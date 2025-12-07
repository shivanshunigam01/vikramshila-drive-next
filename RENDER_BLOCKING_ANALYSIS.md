# Render-Blocking Scripts Analysis

## Current State

### Scripts Found in index.html:

1. **Line 71**: `<script type="application/ld+json">` 
   - **Type**: Inline JSON-LD structured data
   - **Blocking**: NO - This is not a JavaScript script, it's structured data
   - **Action**: No change needed

2. **Line 129**: `<script type="module" src="/src/main.tsx"></script>`
   - **Type**: ES Module (React app entry point)
   - **Blocking**: PARTIALLY - Module scripts are deferred by default in modern browsers, but explicit `defer` helps older browsers
   - **Action**: Add explicit `defer` attribute for better compatibility

3. **Line 132**: `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>`
   - **Type**: External third-party script (Razorpay payment SDK)
   - **Blocking**: YES - This is render-blocking!
   - **Issue**: This script is loaded in index.html, but `loadRazorpay.ts` also dynamically loads it when needed. This creates redundancy.
   - **Action**: Remove from index.html since it's loaded dynamically when needed

### Dynamic Script Loading:

- **loadRazorpay.ts**: Already uses `script.async = true` (line 39) ✅
- **Google reCAPTCHA**: Loaded via react-google-recaptcha package (dynamic) ✅
- **No other blocking scripts found** ✅

---

## Recommendations

### 1. Remove Razorpay Script from index.html
**Reason**: 
- The script is already loaded dynamically via `loadRazorpay.ts` when needed
- Having it in index.html causes unnecessary render-blocking
- Payment functionality only needed on specific pages (Review, CibilCheckWidget)

**Safety**: ✅ SAFE - The dynamic loader handles all cases

### 2. Add `defer` to Main App Script
**Reason**:
- Explicit `defer` ensures script executes after DOM is parsed
- Better compatibility with older browsers
- Module scripts are already deferred, but explicit is clearer

**Safety**: ✅ SAFE - Module scripts + defer work together

### 3. Keep JSON-LD Script As-Is
**Reason**:
- Not a JavaScript script, doesn't block rendering
- Needed for SEO immediately

**Safety**: ✅ No change needed

---

## Expected Impact

### Performance Improvements:
- **Eliminate render-blocking**: Remove Razorpay script (~50-100KB)
- **Faster First Contentful Paint (FCP)**: ~50-100ms improvement
- **Better Time to Interactive (TTI)**: Scripts load only when needed
- **Reduced initial bundle**: Razorpay only loads on payment pages

### No Breaking Changes:
- ✅ Razorpay still works (loaded dynamically)
- ✅ React app still works (defer is safe for modules)
- ✅ All functionality preserved

---

## Execution Order Safety

### Current Flow:
1. HTML parses
2. Razorpay script blocks (if in index.html) ❌
3. Main app script loads
4. React app initializes

### After Changes:
1. HTML parses (no blocking)
2. Main app script loads (deferred, non-blocking)
3. React app initializes
4. Razorpay loads on-demand (when payment needed) ✅

**Result**: No execution order issues - Razorpay is only needed when user initiates payment.

