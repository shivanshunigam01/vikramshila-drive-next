# Static Asset Caching Configuration Guide

## Overview

This document provides optimal caching configurations for static assets in your Vite React application. The configurations are designed to maximize cache efficiency while ensuring fresh content delivery.

## Caching Strategy

### 1. Immutable Assets (Long-term: 1 year)
**Files**: Hashed JS/CSS from Vite build
- **Pattern**: `/assets/*.js`, `/assets/*.css`, `*.mjs`
- **Cache**: `public, max-age=31536000, immutable`
- **Reason**: Vite automatically hashes these files (e.g., `index-abc123.js`). When content changes, the hash changes, so the URL changes. Safe to cache forever.

### 2. Fonts (Long-term: 1 year)
**Files**: `*.woff`, `*.woff2`, `*.eot`, `*.ttf`, `*.otf`
- **Cache**: `public, max-age=31536000, immutable`
- **Reason**: Fonts rarely change. Long cache improves performance.

### 3. Images (Medium-term: 30 days)
**Files**: `*.webp`, `*.jpg`, `*.jpeg`, `*.png`, `*.gif`, `*.svg`, `*.ico`
- **Cache**: `public, max-age=2592000, stale-while-revalidate=86400`
- **Reason**: Images may be updated, but not frequently. `stale-while-revalidate` allows serving stale content while fetching fresh version.

### 4. Data Files (Short-term: 7 days)
**Files**: `*.json`, `*.xml`, `*.txt`
- **Cache**: `public, max-age=604800, stale-while-revalidate=3600`
- **Reason**: Data files may change more frequently (e.g., `india_regions.json`).

### 5. SEO Files (1 day)
**Files**: `robots.txt`, `sitemap.xml`
- **Cache**: `public, max-age=86400`
- **Reason**: These may be updated periodically for SEO.

### 6. HTML Files (No cache)
**Files**: `*.html`, `/` (root)
- **Cache**: `public, max-age=0, must-revalidate`
- **Reason**: HTML contains the app shell and must always be fresh to get latest JS/CSS references.

## File Structure

Your Vite build outputs:
```
dist/
├── index.html              (no cache)
├── assets/
│   ├── index-abc123.js    (1 year, immutable)
│   ├── index-def456.css   (1 year, immutable)
│   └── vendor-ghi789.js   (1 year, immutable)
├── favicon.ico            (7 days)
├── robots.txt             (1 day)
└── sitemap.xml            (1 day)
```

## Configuration Files

### 1. Vercel (`vercel.json`)
- **Location**: Project root
- **Usage**: Automatic on Vercel deployments
- **Best for**: Vercel hosting

### 2. NGINX (`nginx.conf`)
- **Location**: Server configuration or included in main config
- **Usage**: Traditional VPS/dedicated server hosting
- **Best for**: Self-hosted NGINX servers

### 3. Apache (`.htaccess`)
- **Location**: `dist/` directory or web root
- **Usage**: Traditional shared hosting or Apache servers
- **Best for**: Apache hosting, cPanel, shared hosting

## Implementation Instructions

### Vercel
1. Place `vercel.json` in project root
2. Deploy - Vercel automatically applies headers
3. Verify in Network tab after deployment

### NGINX
1. Copy `nginx.conf` content to your server block
2. Adjust `root` path to your `dist/` directory
3. Reload NGINX: `sudo nginx -t && sudo systemctl reload nginx`
4. Test with: `curl -I https://yourdomain.com/assets/index.js`

### Apache
1. Copy `.htaccess` to your `dist/` directory (or web root)
2. Ensure mod_rewrite, mod_expires, mod_headers are enabled
3. Restart Apache: `sudo systemctl restart apache2`
4. Test with: `curl -I https://yourdomain.com/assets/index.js`

## Verification

### Check Headers
```bash
# Check JS file (should have immutable, 1 year)
curl -I https://yourdomain.com/assets/index-abc123.js

# Check image (should have 30 days)
curl -I https://yourdomain.com/assets/hero-1.webp

# Check HTML (should have no-cache)
curl -I https://yourdomain.com/
```

### Expected Headers

**Immutable JS/CSS:**
```
Cache-Control: public, max-age=31536000, immutable
```

**Images:**
```
Cache-Control: public, max-age=2592000, stale-while-revalidate=86400
```

**HTML:**
```
Cache-Control: public, max-age=0, must-revalidate
```

## Cache Invalidation

### Automatic (Vite)
- **JS/CSS**: Automatically invalidated when content changes (hash changes)
- **No action needed**: Vite handles this

### Manual (Images/Data)
- **Images**: Update filename or add query param: `image.webp?v=2`
- **Data files**: Update filename or version query param
- **Or**: Clear CDN cache if using CDN

## Performance Impact

### Expected Improvements:
- **Reduced bandwidth**: ~70-80% reduction in repeat visits
- **Faster page loads**: Cached assets load instantly
- **Better Core Web Vitals**: Improved LCP, FCP scores
- **Lower server costs**: Fewer requests to origin

### Metrics:
- **First visit**: Normal load time
- **Repeat visit**: 50-70% faster (cached assets)
- **Cache hit rate**: 80-90% for returning users

## Troubleshooting

### Issue: Changes not reflecting
**Solution**: Clear browser cache or hard refresh (Ctrl+Shift+R)

### Issue: Assets 404 after deploy
**Solution**: Ensure build output matches server root path

### Issue: HTML cached when it shouldn't be
**Solution**: Check HTML cache headers are set to `max-age=0`

### Issue: Old JS still loading
**Solution**: Vite hash should change automatically. Check build output.

## Additional Optimizations

### CDN Integration
If using a CDN (Cloudflare, CloudFront, etc.):
1. Apply these headers at CDN level
2. Use CDN cache rules for additional control
3. Enable CDN compression (Gzip/Brotli)

### Service Worker (Optional)
For advanced caching:
- Use Workbox with Vite
- Implement service worker for offline support
- Cache API responses

## Security Headers Included

All configs include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## Notes

- **Vite hashing**: Vite automatically hashes JS/CSS files, making them immutable
- **stale-while-revalidate**: Allows serving stale content while fetching fresh version (better UX)
- **immutable**: Tells browser the file will never change (for hashed files)
- **must-revalidate**: Forces revalidation for HTML (always fresh)

