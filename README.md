# Template Generator 🎨

A web application that transforms any website into a clean HTML template. Perfect for quickly creating website mockups, prototypes, or extracting website structure.

## Features ✨

- **URL Analysis**: Paste any website URL and analyze its structure
- **HTML Extraction**: Clean HTML generation without scripts, styles, or clutter
- **Live Preview**: See the generated template in real-time
- **Code View**: Copy and examine the generated HTML code
- **Asset Management**: Extract and view all images from the website
- **Download**: Save templates as downloadable HTML files
- **Copy to Clipboard**: Quickly copy code to your clipboard

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Web Scraping**: Axios, Cheerio

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Steps

1. **Clone or extract the project** to your desired location

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm start
```

Or use nodemon for auto-reload during development:
```bash
npm run dev
```

4. **Open in browser**:
Navigate to `http://localhost:3000` in your web browser

## Usage

1. **Enter a URL**: Paste any website URL in the input field (with or without `https://`)
2. **Generate**: Click "Generate Template" button
3. **Preview**: View the template in the Preview tab
4. **Export**: 
   - Copy the code using the "Copy to Clipboard" button
   - Download as HTML file using the "Download HTML" button
5. **View Assets**: Check extracted images in the Assets tab

## Project Structure

```
template-generator/
├── server.js              # Express server and API endpoints
├── package.json          # Project dependencies
├── .env                  # Environment variables
├── README.md             # This file
└── public/
    ├── index.html        # Main UI
    ├── style.css         # Styling
    └── script.js         # Frontend logic
```

## API Endpoints

### POST /api/generate
Generates a template from a website URL.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "template": "<!DOCTYPE html>...",
  "images": [
    {
      "alt": "Image description",
      "src": "https://example.com/image.jpg"
    }
  ],
  "sourceUrl": "https://example.com"
}
```

## Features in Detail

### Template Cleaning
- Removes all `<script>` and `<style>` tags
- Removes event handlers and data attributes
- Keeps semantic HTML structure (header, nav, main, section, etc.)
- Generates clean, reusable CSS basics

### Image Extraction
- Extracts all images from the webpage
- Converts relative URLs to absolute URLs
- Displays images with their alt text
- Provides direct links to image sources

### HTML Structure
Generated templates include:
- Proper HTML5 document structure
- Responsive viewport meta tag
- Basic CSS for styling (responsive, accessible)
- Clean semantic HTML

## Configuration

Edit `.env` file to customize:
```
PORT=3000              # Server port
NODE_ENV=development   # Environment (development/production)
```

## Error Handling

The application handles:
- Invalid URLs
- Network timeouts
- Unreachable websites
- Malformed HTML
- Image loading failures

All errors are displayed with helpful messages to guide users.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (responsive design)

## Performance Tips

- Templates are generated on-demand
- Images are loaded asynchronously
- Preview uses iframe for isolation
- Code display is syntax-ready (can be enhanced with additional highlighting)

## Security Considerations

- User-provided URLs are validated before fetching
- External content is isolated in iframes
- No sensitive data is stored on the server
- CORS is enabled for safe cross-origin requests

## Limitations

- Very large websites may take longer to process
- Some dynamic/JavaScript-heavy sites may not display correctly
- External scripts are removed (as designed)
- CSS is not fully preserved (by design - clean structure only)

## Future Enhancements

- [ ] Syntax highlighting for code view
- [ ] Custom CSS template options
- [ ] Mobile responsive breakpoint generator
- [ ] Component extraction and organization
- [ ] Template customization options
- [ ] URL history/bookmarking
- [ ] Dark mode toggle
- [ ] SEO metadata extraction

## Troubleshooting

### "Failed to fetch website" error
- Check the URL is correct
- Ensure website is publicly accessible
- Some websites may block automated requests

### Preview not loading
- Check browser console for errors
- Try a different website
- Clear browser cache

### Images not displaying
- The website may be blocking image requests
- Check browser console for CORS errors
- Try a different image source

## Contributing

Feel free to fork, modify, and improve this project for your needs!

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please create an issue or contact the developer.

---

**Made with ❤️** - Happy template generating!
