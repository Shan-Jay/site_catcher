// DOM Elements
const urlForm = document.getElementById('urlForm');
const urlInput = document.getElementById('urlInput');
const generateBtn = document.getElementById('generateBtn');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const successEl = document.getElementById('success');
const outputSection = document.getElementById('outputSection');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const templatePreview = document.getElementById('templatePreview');
const codeDisplay = document.getElementById('codeDisplay');
const assetsList = document.getElementById('assetsList');

// Tab functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

let currentTemplate = '';
let currentUrl = '';

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        // Remove active class from all tabs and buttons
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// Form submission
urlForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const url = urlInput.value.trim();
    
    if (!url) {
        showError('Please enter a valid URL');
        return;
    }
    
    await generateTemplate(url);
});

// Generate Template
async function generateTemplate(url) {
    try {
        // Clear previous messages
        hideError();
        hideSuccess();
        
        // Show loading
        loadingEl.classList.remove('hidden');
        outputSection.classList.add('hidden');
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        
        // Call backend API
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to generate template');
        }
        
        const data = await response.json();
        
        if (data.success) {
            currentTemplate = data.template;
            currentUrl = data.sourceUrl;
            
            // Display template in preview
            displayPreview(data.template);
            
            // Display code
            displayCode(data.template);
            
            // Display assets
            displayAssets(data.images);
            
            // Show output section
            outputSection.classList.remove('hidden');
            
            // Hide loading
            loadingEl.classList.add('hidden');
            
            // Show success message
            showSuccess(`Template generated successfully from ${new URL(currentUrl).hostname}`);
            
            // Reset form
            urlInput.value = '';
            
        } else {
            throw new Error('Failed to generate template');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'An error occurred. Please try again.');
        loadingEl.classList.add('hidden');
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Template';
    }
}

// Display template in iframe
function displayPreview(html) {
    templatePreview.srcdoc = html;
}

// Display code
function displayCode(html) {
    const code = document.querySelector('#codeDisplay code');
    code.textContent = html;
}

// Display assets
function displayAssets(images) {
    assetsList.innerHTML = '';
    
    if (images.length === 0) {
        assetsList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No images found</p>';
        return;
    }
    
    images.forEach((image, index) => {
        const assetItem = document.createElement('div');
        assetItem.className = 'asset-item';
        
        assetItem.innerHTML = `
            <div class="asset-image">
                <img src="${image.src}" alt="${image.alt}" onerror="this.parentElement.textContent = 'Image failed to load'">
            </div>
            <div class="asset-info">
                <p><strong>Alt:</strong> ${image.alt}</p>
                <p><strong>URL:</strong></p>
                <a href="${image.src}" target="_blank" rel="noopener noreferrer">Open Image</a>
            </div>
        `;
        
        assetsList.appendChild(assetItem);
    });
}

// Copy to clipboard
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(currentTemplate).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        showError('Failed to copy to clipboard');
    });
});

// Download HTML
downloadBtn.addEventListener('click', () => {
    const element = document.createElement('a');
    const file = new Blob([currentTemplate], {type: 'text/html'});
    
    element.href = URL.createObjectURL(file);
    
    // Generate filename from URL
    const hostname = new URL(currentUrl).hostname.replace('www.', '');
    const timestamp = new Date().toISOString().slice(0, 10);
    element.download = `${hostname}-template-${timestamp}.html`;
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    showSuccess('Template downloaded successfully!');
});

// Reset button
resetBtn.addEventListener('click', () => {
    urlInput.value = '';
    outputSection.classList.add('hidden');
    urlInput.focus();
});

// Helper functions
function showError(message) {
    errorEl.textContent = '❌ ' + message;
    errorEl.classList.remove('hidden');
}

function hideError() {
    errorEl.classList.add('hidden');
}

function showSuccess(message) {
    successEl.textContent = '✅ ' + message;
    successEl.classList.remove('hidden');
}

function hideSuccess() {
    successEl.classList.add('hidden');
}

// Focus input on load
window.addEventListener('load', () => {
    urlInput.focus();
});
