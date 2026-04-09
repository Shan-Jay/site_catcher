const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Helper function to extract all assets (images, stylesheets, scripts)
function extractAssets(html, baseUrl) {
  const $ = cheerio.load(html);
  const assets = {
    images: [],
    stylesheets: [],
    scripts: []
  };
  const urlObj = new URL(baseUrl);
  const baseURLString = urlObj.origin;
  
  // Extract images
  $('img').each((i, elem) => {
    const src = $(elem).attr('src');
    if (src) {
      let fullUrl = src;
      if (!src.startsWith('http')) {
        fullUrl = src.startsWith('/') ? baseURLString + src : baseURLString + '/' + src;
      }
      assets.images.push({
        alt: $(elem).attr('alt') || 'Image',
        src: fullUrl
      });
    }
  });
  
  // Extract stylesheets
  $('link[rel="stylesheet"]').each((i, elem) => {
    const href = $(elem).attr('href');
    if (href) {
      let fullUrl = href;
      if (!href.startsWith('http')) {
        fullUrl = href.startsWith('/') ? baseURLString + href : baseURLString + '/' + href;
      }
      assets.stylesheets.push(fullUrl);
    }
  });
  
  // Extract external scripts
  $('script[src]').each((i, elem) => {
    const src = $(elem).attr('src');
    if (src) {
      let fullUrl = src;
      if (!src.startsWith('http')) {
        fullUrl = src.startsWith('/') ? baseURLString + src : baseURLString + '/' + src;
      }
      assets.scripts.push(fullUrl);
    }
  });
  
  return assets;
}

// Helper function to clean HTML - removes only harmful scripts
function cleanHTML(html) {
  const $ = cheerio.load(html);
  
  // Remove only dangerous script tags (inline)
  $('script').remove();
  
  // Remove only onclick and other event handlers
  $('*').each((i, elem) => {
    const $elem = $(elem);
    const attrs = elem.attribs;
    
    for (let attr in attrs) {
      if (attr.startsWith('on')) {
        $elem.removeAttr(attr);
      }
    }
  });
  
  return $.html();
}

// Main endpoint to generate template
app.post('/api/generate', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Validate URL
    let validUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      validUrl = 'https://' + url;
    }
    
    // Fetch the website
    const response = await axios.get(validUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 15000
    });
    
    let html = response.data;
    
    // Extract assets
    const assets = extractAssets(html, validUrl);
    
    // Clean HTML (remove only harmful scripts and event handlers)
    const cleanedHtml = cleanHTML(html);
    
    // Generate full template with all assets intact
    const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clone - ${new URL(validUrl).hostname}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        img {
            max-width: 100%;
            height: auto;
        }
    </style>
    ${assets.stylesheets.map(href => `    <link rel="stylesheet" href="${href}">`).join('\n')}
</head>
<body>
${cleanedHtml}
    ${assets.scripts.map(src => `    <script src="${src}"><\/script>`).join('\n')}
</body>
</html>`;
    
    res.json({
      success: true,
      template,
      images: assets.images,
      stylesheets: assets.stylesheets,
      scripts: assets.scripts,
      sourceUrl: validUrl
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch website. Please check the URL and try again.',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
