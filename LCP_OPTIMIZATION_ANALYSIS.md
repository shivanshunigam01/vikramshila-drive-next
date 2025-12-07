# LCP (Largest Contentful Paint) Optimization Analysis

## Current LCP Element Identification

### Primary LCP Element: Hero Banner Image

- **Location**: `src/components/home/Hero.tsx` - First banner in carousel
- **Type**: Dynamic image loaded from API (`https://api.vikramshilaautomobiles.com/api/banners/`)
- **Size**: Large (typically 1920x680 to 1921x801 based on hero images)
- **Current State**:
  - Loaded dynamically via fetch
  - Has `loading="eager"` (good)
  - No preconnect to API domain
  - No fetchpriority attribute

### Secondary LCP Candidates:

1. **FloatingVehicleBanner image** (`new-launch.png` - 5.34 KB) - Small, not LCP
2. **OG Banner** (`/og-banner.jpg`) - Referenced in meta but not in public folder

---

## Optimization Strategy

Since the Hero banner is **dynamic** (loaded from API), we need a multi-pronged approach:

### 1. Preconnect to API Domain

**Why**: Reduces DNS lookup, TCP handshake, and TLS negotiation time
**Impact**: ~200-500ms faster API fetch

### 2. Add fetchpriority="high" to First Banner

**Why**: Tells browser to prioritize loading the first banner image
**Impact**: Browser prioritizes this image over others

### 3. Preload API Endpoint (Optional)

**Why**: Start fetching banner data earlier
**Note**: Less common, but can help

### 4. Resource Hints for Image CDN

**Why**: If banners are hosted on a CDN, preconnect speeds up image loading
**Impact**: Faster image download

---

## Implementation Plan

### Changes Needed:

1. **index.html**: Add preconnect to API domain
2. **Hero.tsx**: Add `fetchpriority="high"` to first banner image
3. **Hero.tsx**: Add `width` and `height` attributes (if known) or aspect-ratio
4. **index.html**: Add preconnect to image CDN (if banners are on different domain)

---

## Expected Impact

- **Faster API fetch**: ~200-500ms improvement with preconnect
- **Prioritized image loading**: Browser prioritizes first banner
- **Better LCP score**: 10-20% improvement expected
- **Faster Time to Interactive**: Reduced blocking time

---

## Safety Considerations

- ✅ Preconnect is safe - only establishes early connection
- ✅ fetchpriority="high" is safe - just a hint to browser
- ✅ No breaking changes - all optimizations are additive
- ✅ Works with dynamic content - doesn't require static URLs
