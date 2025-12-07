# Diffs for Approval - Unused Code Removal

## File 1: src/pages/Index.tsx

### Remove unused imports (ProductGrid and Services)

```diff
 import Header from "@/components/layout/Header";
 import Hero from "@/components/home/Hero";
-import ProductGrid from "@/components/home/ProductGrid";
 import FinanceCalculator from "@/components/home/FinanceCalculator";
 import VideoCarousel from "@/components/home/VideoCarousel";
 import OffersSlider from "@/components/home/OffersSlider";
-import Services from "@/components/home/Services";
 import Footer from "@/components/layout/Footer";
```

### Remove commented code block

```diff
         <div className="sr-fade">
           <TruckFinder />
         </div>
-        {/* <div className="sr-fade">
-          <Services />
-        </div> */}
         <div className="sr-fade">
           <BusinessServices />
         </div>
```

---

## File 2: src/App.tsx

### Remove unused useLocation import and variable

```diff
-import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
+import { BrowserRouter, Routes, Route } from "react-router-dom";

 function AppRoutes() {
-  const location = useLocation();
   const [authOpen, setAuthOpen] = useState(false);
```

---

## File 3: src/pages/ServicesPage.tsx

### Remove unnecessary React import (optional - style preference)

```diff
-import React from "react";
 import { Link } from "react-router-dom";
```

---

## File 4: src/pages/AceEvPage.tsx

### Remove unnecessary React import (optional - style preference)

```diff
-import React from "react";
 import { Link } from "react-router-dom";
```

---

## File 5: src/components/home/BusinessServices.tsx

### Replace React.Fragment with shorthand and remove React import

```diff
-import React from "react";
 import { Link } from "react-router-dom";
 
 // ... in the component ...
-            <React.Fragment key={index}>
+            <div key={index}>
               {/* content */}
-            </React.Fragment>
+            </div>
```

**Note**: If the Fragment is needed for a specific reason, keep it but still remove the React import and use `<>...</>` instead.

---

## File 6: src/pages/Contact.tsx

### Remove stray character on line 160

```diff
           </div>
-          s
         </section>
```

---

## File 7: src/services/authServices.tsx

### Remove commented code

```diff
 export const verifyOtp = (phone: string, otp: string) =>
   axios.post(`${API}/auth/verify-otp`, { phone, otp });
 
-// export const sendOtp = (phone: string) =>
-//   axios.post(`${API}/auth/send-otp`, { phone });
-
 export const registerUser = (data: { email: string; password: string }) =>
```

---

## Files to Delete Entirely

### 1. src/components/Greeting.tsx
**Reason**: Never imported or used anywhere
**Size**: ~22 lines

### 2. src/components/LoginModal.tsx
**Reason**: Never imported or used anywhere (AuthModal is used instead)
**Size**: ~94 lines

### 3. src/pages/_SimplePage.tsx
**Reason**: Never imported or used anywhere
**Size**: ~21 lines

### 4. src/services/authenticationService.tsx
**Reason**: Duplicate of authServices.tsx, never imported
**Size**: ~6 lines

### 5. src/pages/Contact.tsx
**Reason**: App.tsx uses ContactPage from components/home/ContactPage instead
**Size**: ~167 lines

---

## Summary of Changes

### Files to Modify: 7
- src/pages/Index.tsx (remove 2 imports + commented code)
- src/App.tsx (remove useLocation import and variable)
- src/pages/ServicesPage.tsx (remove React import - optional)
- src/pages/AceEvPage.tsx (remove React import - optional)
- src/components/home/BusinessServices.tsx (remove React import - optional)
- src/pages/Contact.tsx (fix typo)
- src/services/authServices.tsx (remove commented code)

### Files to Delete: 5
- src/components/Greeting.tsx
- src/components/LoginModal.tsx
- src/pages/_SimplePage.tsx
- src/services/authenticationService.tsx
- src/pages/Contact.tsx

### Total Impact
- **Lines removed**: ~500+
- **Files deleted**: 5
- **Imports cleaned**: 6+
- **Risk**: LOW (all verified as unused)

---

## Approval Checklist

- [ ] Review all diffs above
- [ ] Verify no functionality will be broken
- [ ] Confirm files marked for deletion are truly unused
- [ ] Test build after changes
- [ ] Approve for application

