# Aline Mart - Testing Checklist

**Phase 9: Testing & Bug Fixes**
**Date:** December 7, 2025
**Tester:** _____________
**Browser:** _____________
**Device:** _____________

---

## 🎯 Testing Strategy

This checklist covers all critical user flows and features of the Aline Mart eCommerce platform. Test each item and mark status:

- ✅ **PASS** - Works as expected
- ❌ **FAIL** - Does not work or has issues
- ⚠️ **PARTIAL** - Works but has minor issues
- 🚫 **SKIP** - Not applicable/not implemented

---

## 1. Homepage Testing

### 1.1 Hero Carousel
- [ ] **Hero carousel auto-plays** (4-second intervals)
- [ ] **Carousel navigation dots work** (click to change slide)
- [ ] **Swipe gestures work on mobile** (left/right swipe changes slides)
- [ ] **Hero images load correctly** (all 5 images visible)
- [ ] **"Shop Now" button links to products page**
- [ ] **Responsive layout** (stacks properly on mobile)

### 1.2 Hot Deals Section
- [ ] **Displays products with sale prices**
- [ ] **Shows correct discount badges**
- [ ] **Product cards display properly** (images, prices, brands)
- [ ] **Hover effects work on desktop**
- [ ] **"View All Deals" button works**

### 1.3 New Arrivals Section
- [ ] **Displays newest products**
- [ ] **"New" badges show on products**
- [ ] **Product grid layout is correct** (responsive)
- [ ] **"View All" button links to filtered products page**

### 1.4 Brand Showcase
- [ ] **19 brand logos display correctly**
- [ ] **Brand logos are crisp and not blurry**
- [ ] **Hover effects work on brand cards**
- [ ] **Clicking brand navigates to brand page**
- [ ] **Responsive grid** (adjusts columns on mobile)

### 1.5 General Homepage
- [ ] **Page loads within 3 seconds**
- [ ] **No console errors**
- [ ] **SEO metadata present** (title, description)
- [ ] **Scroll performance is smooth**

**Notes:**
```
[Add any issues found]
```

---

## 2. Navigation & Header

### 2.1 Desktop Header
- [ ] **Logo displays and links to homepage**
- [ ] **Search bar is visible and functional**
- [ ] **Search suggestions appear (if implemented)**
- [ ] **Navigation menu displays all categories**
- [ ] **Cart icon shows item count badge**
- [ ] **Wishlist icon shows item count badge**
- [ ] **User menu shows "Sign in with Google" when logged out**
- [ ] **Header becomes sticky on scroll**
- [ ] **Header shadow appears on scroll**

### 2.2 Mobile Header
- [ ] **Hamburger menu icon displays**
- [ ] **Mobile menu opens/closes smoothly**
- [ ] **Mobile menu shows all navigation items**
- [ ] **Search bar works on mobile**
- [ ] **Logo is appropriately sized**
- [ ] **Cart/Wishlist icons are visible**
- [ ] **Header height is appropriate (not too tall)**

### 2.3 Search Functionality
- [ ] **Typing in search bar works**
- [ ] **Pressing Enter submits search**
- [ ] **Search redirects to /search page with query**
- [ ] **Search bar clears after submit**

**Notes:**
```
[Add any issues found]
```

---

## 3. Product Listing Page (PLP)

### 3.1 Product Display
- [ ] **Products load and display correctly**
- [ ] **Product images load (no broken images)**
- [ ] **Magazine-style layout** (variable card heights)
- [ ] **Product names truncate properly**
- [ ] **Prices display correctly** (sale prices show strikethrough)
- [ ] **Brand names display**
- [ ] **Stock status shows** (In Stock/Out of Stock)
- [ ] **"New" and "Sale" badges display correctly**

### 3.2 Filters (Desktop Sidebar)
- [ ] **Filter sidebar displays on left**
- [ ] **Category filters work** (check/uncheck)
- [ ] **Brand filters work** (with search if 5+ brands)
- [ ] **Price range filter works** (min/max inputs)
- [ ] **Color swatches work** (12 colors available)
- [ ] **Size buttons work** (XS-XXL, One Size)
- [ ] **Active filters show as chips**
- [ ] **"Clear All" button removes all filters**
- [ ] **Filter sections are collapsible**
- [ ] **Product count updates with filters**

### 3.3 Filters (Mobile Sheet)
- [ ] **"Filter" button displays on mobile**
- [ ] **Filter sheet opens from bottom**
- [ ] **All filter options visible in sheet**
- [ ] **Active filter count badge shows**
- [ ] **"Apply Filters" button works**
- [ ] **Sheet closes properly**
- [ ] **Overlay backdrop appears**

### 3.4 Sorting
- [ ] **Sort dropdown displays**
- [ ] **6 sort options available** (Featured, Newest, Price ↑↓, Name A-Z/Z-A)
- [ ] **Selected option shows checkmark**
- [ ] **Products re-sort correctly**
- [ ] **Result count displays**
- [ ] **Click outside closes dropdown**

### 3.5 Pagination/Load More
- [ ] **"Load More" button appears**
- [ ] **Loading state shows when loading**
- [ ] **More products append to grid**
- [ ] **Button hides when all products loaded**

### 3.6 URL & Sharing
- [ ] **URL updates with filters** (?category=watches&brand=rolex)
- [ ] **URL is shareable** (pasting URL loads with filters)
- [ ] **Browser back/forward works**
- [ ] **No scroll jump on filter change**

### 3.7 Empty States
- [ ] **Empty state shows when no results**
- [ ] **Helpful message displayed**
- [ ] **"Clear filters" suggestion shown**

**Notes:**
```
[Add any issues found]
```

---

## 4. Product Detail Page (PDP)

### 4.1 Product Gallery
- [ ] **Main product image displays**
- [ ] **Image is high quality (not pixelated)**
- [ ] **Thumbnail navigation displays** (4 thumbnails)
- [ ] **Clicking thumbnail changes main image**
- [ ] **Swipe gestures work on mobile** (left/right)
- [ ] **Navigation arrows display** (visible on mobile, hover on desktop)
- [ ] **Image counter shows** (e.g., "1 / 5")
- [ ] **Selected thumbnail has border highlight**

### 4.2 Product Information
- [ ] **Brand name displays and is clickable**
- [ ] **Product title displays correctly**
- [ ] **Price displays** (with sale price if applicable)
- [ ] **Discount badge shows** (if on sale)
- [ ] **Product description displays**
- [ ] **Breadcrumb navigation works**

### 4.3 Variant Selection
- [ ] **Color selector displays** (if product has color variants)
- [ ] **Selected color highlights**
- [ ] **Size selector displays** (if product has size variants)
- [ ] **Selected size highlights**
- [ ] **"Size Guide" link is clickable**
- [ ] **Selected variant updates stock**

### 4.4 Quantity & Stock
- [ ] **Quantity selector displays**
- [ ] **Plus button increases quantity**
- [ ] **Minus button decreases quantity**
- [ ] **Quantity cannot go below 1**
- [ ] **Quantity cannot exceed stock**
- [ ] **Stock status shows** (green "In Stock" or red "Out of Stock")
- [ ] **Stock count displays** (e.g., "25 available")

### 4.5 Add to Cart/Wishlist
- [ ] **"Add to Cart" button displays**
- [ ] **Button is disabled when out of stock**
- [ ] **Clicking adds product to cart**
- [ ] **Cart count updates in header**
- [ ] **Button text changes to "Added to Cart"**
- [ ] **Wishlist heart button toggles**
- [ ] **Heart fills when added to wishlist**
- [ ] **Wishlist count updates in header**

### 4.6 Mobile Sticky Bar
- [ ] **Sticky bar appears on mobile after scrolling**
- [ ] **Shows product thumbnail, name, price**
- [ ] **"Add to Cart" button works from sticky bar**
- [ ] **Sticky bar hides on desktop**
- [ ] **Smooth slide-up animation**

### 4.7 Expandable Sections
- [ ] **"Shipping & Delivery" section expands/collapses**
- [ ] **"Returns & Exchanges" section expands/collapses**
- [ ] **"Product Details" section expands/collapses**
- [ ] **Content displays correctly in each section**
- [ ] **Chevron icons rotate on expand**

### 4.8 Related Products
- [ ] **"You May Also Like" section displays**
- [ ] **6 related products show**
- [ ] **Current product is excluded**
- [ ] **Products use ProductCard component**
- [ ] **Clicking related product navigates correctly**

### 4.9 SEO & Metadata
- [ ] **Dynamic page title** (includes product name)
- [ ] **Meta description present**
- [ ] **Open Graph tags for social sharing**
- [ ] **JSON-LD structured data** (check with Rich Results Test)

**Notes:**
```
[Add any issues found]
```

---

## 5. Shopping Cart

### 5.1 Cart Display
- [ ] **Cart page loads**
- [ ] **Cart items display with thumbnails**
- [ ] **Product names, brands, prices show**
- [ ] **Selected variants display** (color, size)
- [ ] **Item subtotals calculate correctly**

### 5.2 Cart Actions
- [ ] **Quantity +/- buttons work**
- [ ] **Quantity updates cart total**
- [ ] **Remove button (X icon) works**
- [ ] **Confirmation before "Clear Cart"**
- [ ] **"Clear Cart" empties cart**
- [ ] **Cart count updates in header**

### 5.3 Cart Summary
- [ ] **Subtotal displays correctly**
- [ ] **Shipping displays** (Free or calculated)
- [ ] **Tax calculates** (8% estimated)
- [ ] **Total displays correctly** (bold, large font)
- [ ] **Promo code input works**
- [ ] **Test promo "SAVE10" applies discount**
- [ ] **Payment method badges display**
- [ ] **"Secure checkout" badge shows**

### 5.4 Navigation
- [ ] **"Continue Shopping" link works**
- [ ] **"Proceed to Checkout" button visible**
- [ ] **Breadcrumb navigation works**

### 5.5 Empty State
- [ ] **Empty cart state displays when cart is empty**
- [ ] **"Start Shopping" CTA button works**
- [ ] **Friendly empty state message**

### 5.6 Persistence
- [ ] **Cart persists on page refresh**
- [ ] **Cart persists across browser sessions** (localStorage)

**Notes:**
```
[Add any issues found]
```

---

## 6. Search Functionality

### 6.1 Search Results
- [ ] **Search results page displays**
- [ ] **Search query shows in heading**
- [ ] **Results display in product grid**
- [ ] **Result count shows**
- [ ] **Searching for product names works**
- [ ] **Searching for brand names works**
- [ ] **Searching for categories works**

### 6.2 Search States
- [ ] **Loading state displays skeleton screens**
- [ ] **No results state shows helpful message**
- [ ] **Error state handles gracefully**
- [ ] **Empty query shows message**

**Notes:**
```
[Add any issues found]
```

---

## 7. Brand Pages

### 7.1 Brand Listing Page
- [ ] **/brands page displays**
- [ ] **All 19 brands show in grid**
- [ ] **Brand logos display correctly**
- [ ] **Product count shows per brand**
- [ ] **Hover effects work**
- [ ] **Responsive grid** (3-2-1 columns)
- [ ] **Clicking brand navigates to brand page**

### 7.2 Individual Brand Page
- [ ] **/brands/[slug] page displays**
- [ ] **Brand name shows as heading**
- [ ] **Brand description displays (if any)**
- [ ] **All brand products display**
- [ ] **Product count shows**
- [ ] **Breadcrumb navigation works**
- [ ] **Empty state if brand has no products**
- [ ] **SEO metadata present**

**Notes:**
```
[Add any issues found]
```

---

## 8. Category Pages

### 8.1 Category Page
- [ ] **/categories/[slug] page displays**
- [ ] **Category name shows as heading**
- [ ] **Category description displays**
- [ ] **All category products display**
- [ ] **Subcategory navigation** (if applicable)
- [ ] **Breadcrumb navigation works**
- [ ] **Empty state if category has no products**
- [ ] **SEO metadata present**

**Notes:**
```
[Add any issues found]
```

---

## 9. Wishlist (If Implemented)

### 9.1 Wishlist Functionality
- [ ] **Adding to wishlist works**
- [ ] **Removing from wishlist works**
- [ ] **Wishlist count updates**
- [ ] **Wishlist persists** (localStorage)
- [ ] **Wishlist page displays items** (if page exists)
- [ ] **Can move items from wishlist to cart**

**Notes:**
```
[Add any issues found]
```

---

## 10. Responsive Design Testing

### 10.1 Mobile (320px - 640px)
- [ ] **Homepage displays correctly**
- [ ] **Navigation menu works**
- [ ] **Product grid is 1 column**
- [ ] **Product cards are touch-friendly**
- [ ] **Forms are usable**
- [ ] **Text is readable without zooming**
- [ ] **Images scale properly**
- [ ] **No horizontal scroll**
- [ ] **Touch targets ≥ 44x44px**

### 10.2 Tablet (640px - 1024px)
- [ ] **Homepage displays correctly**
- [ ] **Product grid is 2 columns**
- [ ] **Navigation adapts properly**
- [ ] **Filters accessible**
- [ ] **Layout doesn't look cramped**

### 10.3 Desktop (1024px+)
- [ ] **Homepage displays correctly**
- [ ] **Product grid is 3 columns**
- [ ] **Desktop navigation visible**
- [ ] **Hover effects work**
- [ ] **Optimal use of screen space**
- [ ] **Max-width containers prevent over-stretching**

**Notes:**
```
[Add any issues found]
```

---

## 11. Browser Compatibility

Test on the following browsers:

### 11.1 Chrome (Latest)
- [ ] **All features work**
- [ ] **No console errors**
- [ ] **Animations smooth**
- [ ] **Touch gestures work (mobile Chrome)**

### 11.2 Safari (Latest)
- [ ] **All features work**
- [ ] **No console errors**
- [ ] **Webkit-specific styles render correctly**
- [ ] **iOS Safari touch gestures work**

### 11.3 Firefox (Latest)
- [ ] **All features work**
- [ ] **No console errors**
- [ ] **Firefox-specific rendering is correct**

### 11.4 Edge (Latest)
- [ ] **All features work**
- [ ] **No console errors**
- [ ] **Chromium-based Edge renders correctly**

**Notes:**
```
[Add any issues found]
```

---

## 12. Performance Testing

### 12.1 Lighthouse Audit
- [ ] **Performance score > 85**
- [ ] **Accessibility score > 90**
- [ ] **Best Practices score > 90**
- [ ] **SEO score > 90**

### 12.2 Load Times
- [ ] **Homepage loads < 3 seconds**
- [ ] **Product page loads < 3 seconds**
- [ ] **Images lazy load below fold**
- [ ] **No layout shift (CLS < 0.1)**

### 12.3 Network
- [ ] **App works on slow 3G**
- [ ] **Images optimized (WebP format)**
- [ ] **No unnecessary re-renders**

**Notes:**
```
[Add any issues found]
```

---

## 13. Accessibility (WCAG 2.1 AA)

### 13.1 Keyboard Navigation
- [ ] **Can navigate with Tab key**
- [ ] **Focus indicators visible**
- [ ] **Can activate buttons with Enter/Space**
- [ ] **Skip to main content link**
- [ ] **Modal traps focus correctly**

### 13.2 Screen Reader
- [ ] **Alt text on all images**
- [ ] **ARIA labels on interactive elements**
- [ ] **Proper heading hierarchy (h1 → h6)**
- [ ] **Form labels associated with inputs**
- [ ] **Error messages announced**

### 13.3 Visual
- [ ] **Text contrast ratio ≥ 4.5:1**
- [ ] **Text resizable to 200%**
- [ ] **Color is not the only indicator**
- [ ] **Touch targets ≥ 44x44px**

**Notes:**
```
[Add any issues found]
```

---

## 14. Error Handling

### 14.1 Network Errors
- [ ] **API errors show user-friendly messages**
- [ ] **Offline state handled gracefully**
- [ ] **Failed image loads show placeholder**
- [ ] **Retry mechanism for failed requests**

### 14.2 User Errors
- [ ] **Invalid search shows "no results"**
- [ ] **Out of stock items prevent add to cart**
- [ ] **Form validation messages clear**
- [ ] **404 page for invalid URLs**

**Notes:**
```
[Add any issues found]
```

---

## 15. Security & Privacy

### 15.1 Security
- [ ] **HTTPS in production** (not applicable in dev)
- [ ] **No API keys exposed in client code**
- [ ] **XSS protection** (no unescaped user input)
- [ ] **CSRF protection on forms**

### 15.2 Privacy
- [ ] **No personal data logged to console**
- [ ] **localStorage data is minimal**
- [ ] **Third-party scripts reviewed**

**Notes:**
```
[Add any issues found]
```

---

## 🐛 Bug Tracker

Use this section to document all bugs found during testing.

### Bug #1
- **Priority:** Critical / High / Medium / Low
- **Page/Feature:**
- **Description:**
- **Steps to Reproduce:**
  1.
  2.
  3.
- **Expected Behavior:**
- **Actual Behavior:**
- **Browser/Device:**
- **Status:** Open / In Progress / Fixed / Won't Fix

---

### Bug #2
- **Priority:**
- **Page/Feature:**
- **Description:**
- **Steps to Reproduce:**
  1.
  2.
  3.
- **Expected Behavior:**
- **Actual Behavior:**
- **Browser/Device:**
- **Status:**

---

### Bug #3
[Add more as needed]

---

## ✅ Testing Summary

**Total Tests:** _____ / _____
**Pass Rate:** _____%
**Critical Bugs:** _____
**High Priority Bugs:** _____
**Medium Priority Bugs:** _____
**Low Priority Bugs:** _____

**Overall Status:** ✅ Ready for Deployment / ⚠️ Needs Fixes / ❌ Not Ready

**Tester Sign-off:** _____________
**Date:** _____________

---

**End of Testing Checklist**
