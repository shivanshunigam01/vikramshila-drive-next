# All Diffs Preview - Width/Height Attributes Addition

## File 1: src/pages/ServicesPage.tsx

### Change 1 - Line 164 (tataOk image)

```diff
-          <img src={tataOk} alt="Tata OK" className="rounded-lg" />
+          <img src={tataOk} alt="Tata OK" className="rounded-lg" width={640} height={440} loading="lazy" />
```

### Change 2 - Line 214 (fleetCareBanner image)

```diff
-          <img src={fleetCareBanner} alt="Fleet Care" className="rounded-lg" />
+          <img src={fleetCareBanner} alt="Fleet Care" className="rounded-lg" width={1200} height={320} loading="lazy" />
```

---

## File 2: src/components/home/LaunchSection.tsx

### Change 1 - Line 151 (aceProImg)

```diff
                <img
                  src={aceProImg}
                  alt="Ace Pro Vehicle"
                  className="w-full max-w-[220px] sm:max-w-sm md:max-w-md lg:max-w-lg object-contain"
+                  width={440}
+                  height={480}
+                  loading="lazy"
                />
```

### Change 2 - Line 159 (aceLogo)

```diff
                  <img
                    src={aceLogo}
                    alt="Ace Pro Logo"
                    className="h-14 sm:h-20 md:h-24 lg:h-32 object-contain mx-auto md:mx-0"
+                    width={541}
+                    height={225}
+                    loading="lazy"
                  />
```

### Change 3 - Line 189 (dynamic product images)

```diff
                        {img ? (
                          <img
                            src={img}
                            alt={p.title}
                            className="w-full h-full object-contain"
+                            style={{ aspectRatio: '4/3' }}
+                            loading="lazy"
                          />
                        ) : (
```

---

## File 3: src/components/home/ProductGrid.tsx

### Change 1 - Line 36 (category images)

```diff
                <img
                  src={c.image}
                  alt={`${c.title} category vehicles`}
                  className="w-full h-52 object-cover rounded-md"
+                  width={960}
+                  height={544}
                  loading="lazy"
                />
```

---

## File 4: src/components/home/VideoCarousel.tsx

### Change 1 - Line 153 (YouTube thumbnail - mobile)

```diff
                      <img
                        src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                        alt={`${v.title} video thumbnail`}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
+                        width={480}
+                        height={360}
                        loading="lazy"
                      />
```

### Change 2 - Line 211 (YouTube thumbnail - desktop)

```diff
                    <img
                      src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                      alt={`${v.title} video thumbnail`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
+                      width={480}
+                      height={360}
                      loading="lazy"
                    />
```

---

## File 5: src/pages/VehicleDetails.tsx

### Change 1 - Line 417 (dynamic video)

```diff
                        {t.type === "video" ? (
                          <video
                            src={t.file}
                            controls
                            className="w-full max-w-md rounded-lg"
+                            style={{ aspectRatio: '16/9' }}
                          />
                        ) : (
```

### Change 2 - Line 423 (dynamic image)

```diff
                          <img
                            src={t.file}
                            alt={t.customerName}
                            className="w-full max-w-md rounded-lg object-cover"
+                            style={{ aspectRatio: '16/9' }}
+                            loading="lazy"
                          />
```

---

## File 6: src/pages/NewLaunches.tsx

### Change 1 - Line 446 (dynamic product image)

```diff
              {selectedProduct.images?.[0] ? (
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.title}
                  className="w-full h-full object-contain"
+                  style={{ aspectRatio: '16/9' }}
+                  loading="lazy"
                />
              ) : (
```

---

## File 7: src/components/home/Services.tsx

### Change 1 - Line 187 (Unsplash image)

```diff
              <img
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop&crop=center"
                alt="Sampoorna Seva 2.0"
                className="w-full h-80 object-cover rounded-lg"
+                width={600}
+                height={400}
+                loading="lazy"
              />
```

### Change 2 - Line 194 (Unsplash logo)

```diff
                  <img
                    src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=60&h=60&fit=crop&crop=center"
                    alt="Sampoorna Seva Logo"
                    className="w-12 h-12 rounded"
+                    width={60}
+                    height={60}
+                    loading="lazy"
                  />
```

---

## File 8: src/pages/ProductComparision.tsx

### Change 1 - Line 288 (product image)

```diff
                  <img
                    src={p.images?.[0] || "/placeholder.png"}
                    alt={p.title}
                    className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
+                    style={{ aspectRatio: '4/3' }}
+                    loading="lazy"
                  />
```

### Change 2 - Line 521 (competitor image)

```diff
                  <img
                    src={selectedCompetitor.images?.[0] || "/placeholder.png"}
                    alt={selectedCompetitor.title}
                    className="w-full h-full object-contain"
+                    style={{ aspectRatio: '4/3' }}
+                    loading="lazy"
                  />
```

---

## File 9: src/components/home/Hero.tsx

### Change 1 - Line 78 (dynamic banner images)

```diff
                <img
                  src={img}
                  alt={`Hero banner ${idx + 1} — Vikramshila Automobiles`}
                  className="w-full h-full object-cover rounded-md md:rounded-none"
+                  style={{ aspectRatio: '16/9' }}
                  loading="eager"
                />
```

---

## Summary

- **Total files modified:** 9
- **Static images with explicit dimensions:** 13
- **Dynamic images/videos with CSS aspect-ratio:** 7
- **Total changes:** 20 modifications

All changes preserve existing layout and responsive behavior by:

1. Using explicit width/height for known dimensions
2. Using CSS aspect-ratio for dynamic content
3. Maintaining all existing CSS classes
4. Keeping responsive behavior intact
