# 🎯 QUICK ACTION CHECKLIST
## Restaurant Deliorman - Priority Fixes

Last Updated: November 3, 2025

---

## ⚠️ **CRITICAL - DO NOW** (Security Risk)

- [ ] **1.** Go to https://resend.com/api-keys and REVOKE: `re_iZjkg7pU_H7GApe8f6zxuvYJUGV81YN9w`
- [ ] **2.** Generate NEW Resend API key
- [ ] **3.** Update `.env` file with new key (DO NOT commit!)
- [ ] **4.** Verify `.env` is in `.gitignore`
- [ ] **5.** Update Vercel project settings with new key
- [ ] **6.** Run: `git log --all --full-history -- .env` (check if leaked)

---

## 🔥 **HIGH PRIORITY - This Week**

### Images (Performance Impact)
- [ ] **7.** Migrate `About.jsx` to use `<OptimizedImage>`
- [ ] **8.** Migrate `Schedule.jsx` to use `<OptimizedImage>`
- [ ] **9.** Migrate `Features.jsx` to use `<OptimizedImage>`
- [ ] **10.** Migrate `ProductItem.jsx` to use `<OptimizedImage>`
- [ ] **11.** Migrate `ServiceItem.jsx` to use `<OptimizedImage>`
- [ ] **12.** Migrate `Testimonial.jsx` to use `<OptimizedImage>`
- [ ] **13.** Migrate `NewSpecialtiesCTA.jsx` to use `<OptimizedImage>`
- [ ] **14.** Migrate all menu images to use `<OptimizedImage>`

### SEO Configuration
- [ ] **15.** Update domain in `src/app/layout.jsx` (line 27)
- [ ] **16.** Update domain in `src/app/robots.ts` (line 5)
- [ ] **17.** Update domain in `src/app/sitemap.ts` (line 6)
- [ ] **18.** Update URLs in `src/app/_components/StructuredData.jsx`
- [ ] **19.** Add real phone number to `StructuredData.jsx`
- [ ] **20.** Add real address to `StructuredData.jsx`
- [ ] **21.** Update opening hours in `StructuredData.jsx`

### Images & Assets
- [ ] **22.** Create Open Graph image at `/public/img/og-image.jpg` (1200x630px)
- [ ] **23.** OR use dynamic generator at `src/app/opengraph-image.tsx` (already works)

---

## 📊 **MEDIUM PRIORITY - This Month**

### Performance
- [ ] **24.** Run `npm run analyze` and review bundle size
- [ ] **25.** Lazy load Mapbox on contact page only (see example in audit)
- [ ] **26.** Lazy load Testimonial slider (below fold)
- [ ] **27.** Lazy load Subscribe section (bottom of page)
- [ ] **28.** Lazy load ReservationForm modal

### Code Quality
- [ ] **29.** Audit `About.jsx` - remove "use client" if no hooks/handlers
- [ ] **30.** Audit `Features.jsx` - remove "use client" if possible
- [ ] **31.** Audit `ContactInfo.jsx` - remove "use client" if possible
- [ ] **32.** Audit `Divider` component - remove "use client" if possible

### Accessibility
- [ ] **33.** Add meaningful alt text to all product images
- [ ] **34.** Add aria-labels to all icon buttons
- [ ] **35.** Test keyboard navigation (Tab through entire site)
- [ ] **36.** Test with screen reader (NVDA or JAWS)

---

## 🎨 **LOW PRIORITY - Nice to Have**

### TypeScript Migration
- [ ] **37.** Rename `layout.jsx` → `layout.tsx`
- [ ] **38.** Rename `page.jsx` → `page.tsx`
- [ ] **39.** Add types to OptimizedImage component
- [ ] **40.** Add types to all form components

### Testing & Validation
- [ ] **41.** Run Lighthouse test (target: 90+ in all categories)
- [ ] **42.** Test on mobile devices (real devices)
- [ ] **43.** Test social media sharing (Facebook, Twitter)
- [ ] **44.** Verify structured data: https://search.google.com/test/rich-results

### Documentation
- [ ] **45.** Merge `README_NEW.md` content into existing README
- [ ] **46.** Add contributing guidelines
- [ ] **47.** Document environment variables in detail

---

## ✅ **COMPLETED** (No Action Needed)

- ✅ Next.js updated to 14.2.33+ (security fixes)
- ✅ All npm vulnerabilities fixed (0 remaining)
- ✅ Security headers added to next.config.js
- ✅ robots.ts created
- ✅ sitemap.ts created (dynamic)
- ✅ Structured data (JSON-LD) added
- ✅ Metadata enhanced (OpenGraph, Twitter)
- ✅ Hero slider migrated to next/image
- ✅ OptimizedImage component created
- ✅ Bundle analyzer configured
- ✅ .env.example created
- ✅ Footer lazy-loaded
- ✅ TypeScript configured
- ✅ Vercel config created

---

## 📈 PROGRESS TRACKER

**Security:** 🟡 50% (API key needs revocation)  
**Performance:** 🟡 20% (Hero done, 15+ images remain)  
**SEO:** 🟢 80% (Just need domain updates)  
**Accessibility:** 🔴 10% (Needs full audit)  
**Code Quality:** 🟡 40% (TS ready, needs migration)

---

## 🚀 ESTIMATED TIME

- **Critical (Security):** 15 minutes
- **High Priority (Images + SEO):** 4-6 hours
- **Medium Priority:** 2-3 days
- **Low Priority:** 1-2 weeks

---

## 📞 HELP

Stuck? Check:
1. `AUDIT_REPORT.md` - Full detailed audit
2. Code comments marked `// TODO:`
3. Next.js documentation: https://nextjs.org/docs

**Note:** Test incrementally. Don't change everything at once!
