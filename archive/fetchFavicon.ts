/**
 * Fetches the favicon URL for a given website
 * @param {string} url - Website URL
 * @returns {Promise<string>} - URL of the favicon
 */
async function getFavicon(url) {
    const baseURL = new URL(url);
    const origin = baseURL.origin;
    const candidates = [];

    // Helper function to parse size attributes
    const parseSize = (sizeString) => {
        if (!sizeString) return 0;
        if (sizeString === 'any') return 1000000; // Arbitrary large number
        
        return Math.max(...sizeString.split(/\s+/)
            .filter(s => s.includes('x'))
            .map(s => {
                const [w, h] = s.split('x').map(Number);
                return w * h;
            })
            .reduce((max, area) => Math.max(max, area), 0);
    };

    // Helper to resolve relative URLs
    const resolveUrl = (base, relative) => new URL(relative, base).href;

    // 1. Try to fetch HTML and parse link tags
    try {
        const response = await fetch(url, {
            headers: {'User-Agent': 'Mozilla/5.0 (compatible; FaviconFetcher)'}
        });
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Find all relevant link tags
        const iconSelectors = [
            'link[rel="icon"]',
            'link[rel="shortcut icon"]',
            'link[rel="apple-touch-icon"]',
            'link[rel="apple-touch-icon-precomposed"]'
        ];
        
        document.querySelectorAll(iconSelectors.join(',')).forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            candidates.push({
                url: resolveUrl(url, href),
                size: parseSize(link.getAttribute('sizes')),
                priority: 1
            });
        });

        // 2. Check Web App Manifest
        const manifestLink = doc.querySelector('link[rel="manifest"]');
        if (manifestLink) {
            const manifestHref = manifestLink.getAttribute('href');
            if (manifestHref) {
                const manifestURL = resolveUrl(url, manifestHref);
                try {
                    const manifestResponse = await fetch(manifestURL);
                    const manifest = await manifestResponse.json();
                    
                    if (manifest.icons && manifest.icons.length) {
                        manifest.icons.forEach(icon => {
                            if (icon.src) {
                                candidates.push({
                                    url: resolveUrl(manifestURL, icon.src),
                                    size: parseSize(icon.sizes),
                                    priority: 2
                                });
                            }
                        });
                    }
                } catch (e) {
                    console.warn('Failed to fetch manifest:', e);
                }
            }
        }
    } catch (e) {
        console.warn('HTML fetch failed, using fallbacks:', e);
    }

    // 3. Add default favicon location
    candidates.push({
        url: `${origin}/favicon.ico`,
        size: 0,
        priority: 3
    });

    // Sort candidates by:
    // 1. Priority (lower first)
    // 2. Size (larger first)
    // 3. URL stability (.ico last)
    candidates.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        if (b.size !== a.size) return b.size - a.size;
        return a.url.endsWith('.ico') ? 1 : -1;
    });

    return candidates[0].url;
}

// Usage Example
getFavicon('https://example.com')
    .then(faviconUrl => console.log('Favicon URL:', faviconUrl))
    .catch(error => console.error('Error:', error));