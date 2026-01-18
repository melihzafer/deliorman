# 🚀 Feedback System - Setup & Testing Guide

## ✅ Build Status
**Status:** Successfully built and ready for production!

---

## 📦 Installation Complete

All dependencies are installed:
- ✅ `formik` - Form state management
- ✅ `zod` - Schema validation
- ✅ `zod-formik-adapter` - Bridge between Formik and Zod
- ✅ `framer-motion` - Already installed (animations)
- ✅ `resend` - Already installed (email delivery)

---

## 🔧 Environment Setup

Add these environment variables to your `.env.local` file:

```bash
# Required - Get your API key from https://resend.com
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional - Customize email addresses
FEEDBACK_EMAIL=restaurantdeliorman@gmail.com
FEEDBACK_SENDER_EMAIL=Deliorman Feedback <feedback@restorantdeliorman.com>
```

### Getting a Resend API Key:
1. Sign up at https://resend.com (free tier: 100 emails/day)
2. Go to API Keys section
3. Create a new API key
4. Add it to your `.env.local` file

### Verified Sender Domain (Recommended):
For better email deliverability, verify your domain in Resend:
1. Go to Domains in Resend dashboard
2. Add `restorantdeliorman.com`
3. Add the DNS records they provide
4. Once verified, update `FEEDBACK_SENDER_EMAIL` to use your domain

---

## 🧪 Testing Checklist

### 1. Development Server
```bash
npm run dev
```
Visit http://localhost:3000

### 2. Test FAB (Floating Action Button)
- [ ] Look for 💬 button in bottom-right corner
- [ ] Click it to open modal
- [ ] Modal should animate in smoothly
- [ ] Click outside modal or ESC key to close
- [ ] Focus should return to FAB button after closing

### 3. Test Feedback Page
- [ ] Visit http://localhost:3000/feedback
- [ ] See page banner and form
- [ ] Form should have: Category, Rating, Message fields

### 4. Test Form Validation (Client-Side)
- [ ] Try submitting empty form → Should show "minimum 10 characters" error
- [ ] Type 5 characters → Counter should be red (5/1000)
- [ ] Type 15 characters → Counter should be gray (15/1000)
- [ ] Error message should appear below textarea

### 5. Test Form Submission (Without API Key)
- [ ] Remove `RESEND_API_KEY` from `.env.local`
- [ ] Restart dev server
- [ ] Submit valid feedback
- [ ] Should see error: "Системата за обратна връзка не е конфигурирана"

### 6. Test Form Submission (With API Key)
- [ ] Add `RESEND_API_KEY` to `.env.local`
- [ ] Restart dev server
- [ ] Fill form with:
  - Category: "Храна"
  - Rating: "5 stars"
  - Message: "Страхотна храна и атмосфера!"
- [ ] Submit form
- [ ] Should see green success message
- [ ] Check your email inbox for the feedback

### 7. Test Keyboard Accessibility
- [ ] Press Tab to navigate to FAB
- [ ] Press Enter/Space to open modal
- [ ] Tab through form fields (Category → Rating → Message → Submit → Close)
- [ ] Shift+Tab to go backwards
- [ ] Press ESC to close modal
- [ ] Focus should return to FAB

### 8. Test on Mobile
- [ ] Open on mobile device or use browser DevTools (F12 → Toggle device toolbar)
- [ ] FAB should be visible and clickable
- [ ] Modal should be responsive
- [ ] Form should be easy to fill on mobile
- [ ] Success message should display properly

### 9. Test Error Scenarios
- [ ] Submit message with 1001+ characters → Should show length error
- [ ] Disconnect internet → Submit → Should show connection error
- [ ] Invalid email configuration → Should show delivery error

---

## 📧 Email Template Example

When feedback is submitted, you'll receive an email like this:

```
Subject: Нова обратна връзка - Храна (5⭐)

Нова анонимна обратна връзка за Ресторант Делиорман

Категория: Храна
Оценка: ⭐⭐⭐⭐⭐ (5/5)

Съобщение:
Страхотна храна и атмосфера!

---
Получено: 17.1.2026 г., 15:30:45
IP адрес: 192.168.1.100
User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)...
```

---

## 🎯 Features to Test

### Core Features:
- ✅ Anonymous submission (no login required)
- ✅ Dual access (FAB modal + dedicated page)
- ✅ Client-side validation (Formik + Zod)
- ✅ Server-side validation (Zod)
- ✅ Real-time character counter
- ✅ Email delivery via Resend
- ✅ Success confirmation with animation

### Accessibility Features:
- ✅ Focus trap in modal
- ✅ ESC key to close
- ✅ Focus restoration
- ✅ ARIA attributes (role, aria-modal, aria-labelledby)
- ✅ Keyboard navigation
- ✅ Screen reader support

### Error Handling:
- ✅ Client validation errors displayed
- ✅ Server validation errors mapped to fields
- ✅ Email delivery failure handling
- ✅ Missing API key detection

---

## 🐛 Troubleshooting

### Issue: "Module not found: zod-formik-adapter"
**Solution:** Run `npm install zod-formik-adapter`

### Issue: "RESEND_API_KEY not configured"
**Solution:** Add `RESEND_API_KEY=your_key_here` to `.env.local` and restart dev server

### Issue: Emails not being received
**Checks:**
1. Verify API key is correct in `.env.local`
2. Check Resend dashboard for delivery logs
3. Check spam folder
4. Verify recipient email is correct
5. If using custom domain, ensure DNS records are set up

### Issue: SCSS import errors
**Solution:** Import paths should use `@import '../variables';` (relative to the scss/ui folder)

### Issue: Build warnings about deprecated Sass @import
**Note:** These are deprecation warnings from Sass, not errors. They affect the entire codebase and don't prevent the app from working. Can be addressed in a future refactor.

---

## 🚀 Deployment

### Before deploying to production:

1. **Set Environment Variables** in your hosting platform (Vercel/Netlify):
   ```
   RESEND_API_KEY=your_production_key
   FEEDBACK_EMAIL=restaurantdeliorman@gmail.com
   FEEDBACK_SENDER_EMAIL=Deliorman Feedback <feedback@restorantdeliorman.com>
   ```

2. **Verify Domain** in Resend for better deliverability

3. **Test thoroughly** on staging environment

4. **Monitor** Resend dashboard for delivery rates

---

## 📊 Monitoring

After deployment, monitor:
- Resend dashboard for email delivery success rates
- Browser console for any JavaScript errors
- Server logs for API errors
- User feedback about the feature

---

## ✨ What's New

All files created/modified:

**New Components:**
- `src/app/_components/forms/FeedbackForm.jsx`
- `src/app/_components/ui/FeedbackModal.jsx`
- `src/app/_components/ui/FeedbackFAB.jsx`

**New Styles:**
- `src/app/_styles/scss/ui/FAB.module.scss`
- `src/app/_styles/scss/ui/FeedbackModal.module.scss`
- `src/app/(pages)/feedback/Feedback.module.scss`

**New Pages:**
- `src/app/(pages)/feedback/page.jsx`

**New API:**
- `src/app/api/feedback/route.js`

**Modified:**
- `src/app/layout.jsx` (added FeedbackFAB)

---

## 🎉 Ready to Go!

Your feedback system is production-ready! Just add your Resend API key and start collecting valuable customer feedback.

For questions or issues, check the [FEEDBACK_IMPROVEMENTS_SUMMARY.md](./FEEDBACK_IMPROVEMENTS_SUMMARY.md) for detailed implementation notes.
