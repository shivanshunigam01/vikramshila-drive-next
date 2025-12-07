# Lazy Loading Strategy

## Analysis Results

### Components >50KB (Must be lazy loaded):

1. **Review.tsx** - 61.46 KB
2. **Products.tsx** - 52.89 KB

### Components Below the Fold (Should be lazy loaded):

1. **ProductDisplay.tsx** - 17.42 KB
2. **Faq.tsx** - 17.36 KB
3. **CibilCheckWidget.tsx** - 15.87 KB
4. **Services.tsx** - 13.33 KB
5. **blogs.tsx** - 11.26 KB
6. **LaunchSection.tsx** - 11.04 KB
7. **VideoCarousel.tsx** - 9.57 KB
8. **OffersSlider.tsx** - 9.18 KB
9. **TruckFinder.tsx** - 8.65 KB
10. **BusinessServices.tsx** - 6.18 KB
11. **FinanceCalculator.tsx** - 5.67 KB
12. **FloatingVehicleBanner.tsx** - 5.34 KB
13. **EnquireNow.tsx** - 5.22 KB

### Route Pages (Should be lazy loaded):

- All pages except Index should be lazy loaded
- Large pages: Products (52.89 KB), NewLaunches (26.15 KB), ProductComparision (20.9 KB), VehicleDetails (17.06 KB), About (13.56 KB), BookService (12.54 KB)

### Above the Fold (Must stay static):

- **Header** - Always visible
- **Hero** - First thing users see
- **Index page** - Small (3.82 KB), entry point
- **Footer** - Can be lazy loaded (at bottom)
- **FloatingCTAs** - Can be lazy loaded (floating element)
- **ScrollRevealer** - Can be lazy loaded (utility)

## Implementation Plan

1. **App.tsx**: Convert all route pages to lazy imports
2. **Index.tsx**: Convert below-the-fold components to lazy imports
3. Create a shared loading fallback component
4. Ensure critical above-the-fold components remain static
