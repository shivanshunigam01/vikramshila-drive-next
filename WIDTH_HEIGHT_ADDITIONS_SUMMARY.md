# Width and Height Attributes Addition Summary

## Overview

This document shows all `<img>` and `<video>` tags that need width and height attributes added to prevent layout shifts.

## Image Dimensions Reference

| Image File                         | Width | Height |
| ---------------------------------- | ----- | ------ |
| image(3).png                       | 640   | 440    |
| fleet-care_new_banner.jpg          | 1200  | 320    |
| vehicle.png                        | 440   | 480    |
| acepro.png                         | 541   | 225    |
| cat-\*.jpg (all category images)   | 960   | 544    |
| YouTube thumbnails (hqdefault.jpg) | 480   | 360    |

## Files to Modify

### 1. src/pages/ServicesPage.tsx

**Missing width/height:**

- Line 164: `tataOk` image (image(3).png) - 640x440
- Line 214: `fleetCareBanner` image (fleet-care_new_banner.jpg) - 1200x320

**Changes:**

```tsx
// Line 164 - ADD width and height
<img src={tataOk} alt="Tata OK" className="rounded-lg" width={640} height={440} loading="lazy" />

// Line 214 - ADD width and height
<img src={fleetCareBanner} alt="Fleet Care" className="rounded-lg" width={1200} height={320} loading="lazy" />
```

---

### 2. src/components/home/LaunchSection.tsx

**Missing width/height:**

- Line 151: `aceProImg` (vehicle.png) - 440x480
- Line 159: `aceLogo` (acepro.png) - 541x225
- Line 189: Dynamic product images (from API) - Use aspect-ratio CSS

**Changes:**

```tsx
// Line 151 - ADD width and height
<img
  src={aceProImg}
  alt="Ace Pro Vehicle"
  className="w-full max-w-[220px] sm:max-w-sm md:max-w-md lg:max-w-lg object-contain"
  width={440}
  height={480}
  loading="lazy"
/>

// Line 159 - ADD width and height
<img
  src={aceLogo}
  alt="Ace Pro Logo"
  className="h-14 sm:h-20 md:h-24 lg:h-32 object-contain mx-auto md:mx-0"
  width={541}
  height={225}
  loading="lazy"
/>

// Line 189 - ADD aspect-ratio style (dimensions unknown, use CSS)
<img
  src={img}
  alt={p.title}
  className="w-full h-full object-contain"
  style={{ aspectRatio: '4/3' }}
  loading="lazy"
/>
```

---

### 3. src/components/home/ProductGrid.tsx

**Missing width/height:**

- Line 36: Category images (cat-\*.jpg) - 960x544

**Changes:**

```tsx
// Line 36 - ADD width and height
<img
  src={c.image}
  alt={`${c.title} category vehicles`}
  className="w-full h-52 object-cover rounded-md"
  width={960}
  height={544}
  loading="lazy"
/>
```

---

### 4. src/components/home/VideoCarousel.tsx

**Missing width/height:**

- Line 153: YouTube thumbnail (mobile) - 480x360
- Line 211: YouTube thumbnail (desktop) - 480x360

**Changes:**

```tsx
// Line 153 - ADD width and height
<img
  src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
  alt={`${v.title} video thumbnail`}
  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
  width={480}
  height={360}
  loading="lazy"
/>

// Line 211 - ADD width and height
<img
  src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
  alt={`${v.title} video thumbnail`}
  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
  width={480}
  height={360}
  loading="lazy"
/>
```

---

### 5. src/pages/VehicleDetails.tsx

**Missing width/height:**

- Line 417: Dynamic video element - Use aspect-ratio CSS
- Line 423: Dynamic image element - Use aspect-ratio CSS

**Changes:**

```tsx
// Line 417 - ADD aspect-ratio style (dimensions unknown)
<video
  src={t.file}
  controls
  className="w-full max-w-md rounded-lg"
  style={{ aspectRatio: '16/9' }}
/>

// Line 423 - ADD aspect-ratio style (dimensions unknown)
<img
  src={t.file}
  alt={t.customerName}
  className="w-full max-w-md rounded-lg object-cover"
  style={{ aspectRatio: '16/9' }}
  loading="lazy"
/>
```

---

### 6. src/pages/NewLaunches.tsx

**Missing width/height:**

- Line 446: Dynamic product images (from API) - Use aspect-ratio CSS

**Changes:**

```tsx
// Line 446 - ADD aspect-ratio style (dimensions unknown)
<img
  src={selectedProduct.images[0]}
  alt={selectedProduct.title}
  className="w-full h-full object-contain"
  style={{ aspectRatio: "16/9" }}
  loading="lazy"
/>
```

---

### 7. src/components/home/ProductDisplay.tsx

**Already has loading="lazy"** - No changes needed (uses aspect-[4/3] container)

---

### 8. src/pages/Products.tsx

**Already has loading="lazy"** - No changes needed (uses aspect-[4/3] container)

---

### 9. src/pages/ProductComparision.tsx

**Missing width/height:**

- Line 288: Dynamic product images - Use aspect-ratio CSS
- Line 521: Dynamic competitor images - Use aspect-ratio CSS

**Changes:**

```tsx
// Line 288 - ADD aspect-ratio style
<img
  src={p.images?.[0] || "/placeholder.png"}
  alt={p.title}
  className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
  style={{ aspectRatio: '4/3' }}
  loading="lazy"
/>

// Line 521 - ADD aspect-ratio style
<img
  src={selectedCompetitor.images?.[0] || "/placeholder.png"}
  alt={selectedCompetitor.title}
  className="w-full h-full object-contain"
  style={{ aspectRatio: '4/3' }}
  loading="lazy"
/>
```

---

### 10. src/components/home/Services.tsx

**Missing width/height:**

- Line 187: External Unsplash image - Use aspect-ratio CSS
- Line 194: External Unsplash image - Use aspect-ratio CSS

**Changes:**

```tsx
// Line 187 - ADD aspect-ratio style (external image, dimensions from URL params: 600x400)
<img
  src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop&crop=center"
  alt="Sampoorna Seva 2.0"
  className="w-full h-80 object-cover rounded-lg"
  width={600}
  height={400}
  loading="lazy"
/>

// Line 194 - ADD width and height (external image, dimensions from URL params: 60x60)
<img
  src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=60&h=60&fit=crop&crop=center"
  alt="Sampoorna Seva Logo"
  className="w-12 h-12 rounded"
  width={60}
  height={60}
  loading="lazy"
/>
```

---

### 11. src/components/home/Hero.tsx

**Missing width/height:**

- Line 78: Dynamic banner images (from API) - Use aspect-ratio CSS

**Note:** These are hero banners with responsive height classes. We'll use CSS aspect-ratio to maintain layout.

**Changes:**

```tsx
// Line 78 - ADD aspect-ratio style (dimensions unknown, but container has responsive height)
<img
  src={img}
  alt={`Hero banner ${idx + 1} — Vikramshila Automobiles`}
  className="w-full h-full object-cover rounded-md md:rounded-none"
  style={{ aspectRatio: "16/9" }}
  loading="eager"
/>
```

---

## Summary

### Static Images (with known dimensions):

- ✅ 2 images in ServicesPage.tsx
- ✅ 2 images in LaunchSection.tsx
- ✅ 1 image in ProductGrid.tsx
- ✅ 2 images in VideoCarousel.tsx
- ✅ 2 images in Services.tsx

### Dynamic Images (use CSS aspect-ratio):

- ✅ 1 image in LaunchSection.tsx (product images)
- ✅ 2 elements in VehicleDetails.tsx (video + image)
- ✅ 1 image in NewLaunches.tsx
- ✅ 2 images in ProductComparision.tsx
- ✅ 1 image in Hero.tsx

### Total Changes:

- **10 files** need modifications
- **13 static images** get explicit width/height
- **7 dynamic images/videos** get CSS aspect-ratio

## Layout Preservation Strategy

1. **Static images**: Add explicit width/height attributes matching actual dimensions
2. **Dynamic images**: Use CSS `aspect-ratio` property to maintain container proportions
3. **Existing containers**: Keep all existing CSS classes and container divs unchanged
4. **Responsive behavior**: Width/height attributes work with CSS classes (w-full, h-full, etc.) to maintain responsiveness
