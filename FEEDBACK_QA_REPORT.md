# Anonymous Feedback System QA Report

Generated: 2026-01-17
Scope: /feedback page, Quick Action FAB + Modal, Email delivery pipeline (/api/feedback)

## Executive Summary
Overall status: Yellow – core flow works, but anonymity guarantees, accessibility, and delivery reliability need improvements before production.

---

## Confirmed Implementation (by code inspection)
- Dedicated page: src/app/(pages)/feedback/page.jsx renders <FeedbackForm /> with banner and copy.
- Quick Action: src/app/_components/ui/FeedbackFAB.jsx mounted globally in src/app/layout.jsx, opens src/app/_components/ui/FeedbackModal.jsx.
- API route: src/app/api/feedback/route.js validates payload (zod), logs, and sends email via Resend when RESEND_API_KEY is set.

---

## Bugs and Issues

### Critical
1) “Anonymous” claim violated by PII capture in email
- Files: src/app/api/feedback/route.js lines 57–59 include IP (x-forwarded-for) and user-agent in the email body.
- Impact: Breaks anonymity expectation; privacy/data protection risk.
- Fix: Remove IP/User-Agent from email (and any logs). If needed for abuse monitoring, aggregate metrics server-side without tying to individual submissions.

2) Silent delivery failure still returns success
- Files: route.js lines 68–78 – when RESEND_API_KEY is missing, the code logs a warning but returns success to client.
- Impact: Users think feedback is delivered when it isn’t; lost data.
- Fix: Return 503 with explicit “delivery disabled” message when email isn’t configured, or buffer to a durable fallback (Google Sheets) and return 200 after persisting.

### Major
3) No rate limiting / abuse protection
- Files: route.js – no throttling or abuse checks.
- Impact: Spam/DoS via serverless invocations.
- Fix: Add basic IP-based rate limiting (KV/Upstash/Vercel Rate Limit) or token bucket; add server-side content filters (links, profanity) as needed.

4) Accessibility gaps in Modal
- Files: FeedbackModal.jsx – no focus trap, no ESC-to-close, body scroll lock is simplistic (style.overflow).
- Impact: Keyboard-only and screen-reader users have difficulty; potential scroll-jank.
- Fix: Implement focus trap (e.g., focus-lock), set initial focus, support Escape key, restore original body overflow state.

5) Missing server-side surfacing of validation errors
- Files: FeedbackForm.jsx lines 56–67 – generic error on non-OK response, ignores server-provided error list.
- Impact: Users don’t know what to fix when server-side validation fails.
- Fix: Parse JSON {errors:[{field,message}]} and map to field-level messages.

### Minor
6) Success UX missing on /feedback page
- Files: page.jsx line 44 – <FeedbackForm /> is rendered without onSuccess handler.
- Impact: Submissions appear to do nothing beyond reset; no positive feedback.
- Fix: Pass onSuccess to show toast or inline success message; optionally confetti (already in deps).

7) FAB/Modal ARIA enhancements
- Files: FeedbackFAB.jsx / FeedbackModal.jsx.
- Impact: Better semantics/accessibility.
- Fix: aria-expanded on FAB, role="dialog" + aria-modal on modal container, labelledby for header.

8) Delivery address and sender domain
- Files: route.js line 71 uses onboarding@resend.dev.
- Impact: Lower deliverability; DMARC alignment issues.
- Fix: Use verified sender at your domain (e.g., feedback@restorantdeliorman.com) configured in Resend.

---

## UI/UX Improvements
- Feedback form: Inline field-level errors for server-side responses; preserve user input on error.
- Add character counter for message (min 10, max 1000) and live validation.
- Clear success state: toast + inline “Thanks for your feedback” message; optionally offer “Submit another”.
- Category/rating: Improve labels (tooltips) and default placeholders; consider star-picker widget for rating.
- Modal: Add backdrop click-to-close (already present) plus ESC-to-close; ensure mobile spacing and safe-area insets.
- FAB: Reduce visual noise; add tooltip; ensure it doesn’t overlap chat or cookie banners.

---

## Feature Proposals
- Dual persistence pipeline: Email + Google Sheets append (src/lib/google-sheets.ts exists). If email fails, still store.
- Optional contact channel: allow opt-in contact details (email/phone) with consent checkbox; keep default anonymous.
- Admin dashboard: simple page listing recent feedback with filters (service/food/vibes) and export CSV.
- Moderation: Server-side filters for links/profanity; auto-flagging for review.
- Throttling: per-IP/hour limits and reCAPTCHA or invisible honeypot field in form.
- Telemetry: Aggregate counts by day/category without storing PII.

---

## Email Pipeline Audit
- Validation: zod schema matches client (rating number vs string conversion handled); good.
- Observability: Add structured logs (request ID), notify on failures.
- Resilience: Use retries/backoff; adopt queue or background function if volume grows.
- Content: Provide concise subject and plaintext body; consider HTML template; localize consistently.
- Security: Remove PII; verify sender domain; store admin email in env.

---

## Accessibility Checklist (Modal & Form)
- Focus trap and initial focus on first interactive element.
- ESC-to-close, role="dialog", aria-modal, aria-labelledby for header.
- Keyboard navigation through controls; visible focus states.
- Labels associated to inputs; error messages announced (aria-live="polite").

---

## Test Recommendations
- Unit: zod schema edge cases (min/max length, rating bounds, enum category).
- Integration: FAB opens/closes modal; form submits success/error paths; server returns errors mapped to UI.
- E2E: /feedback page flow on mobile/desktop; accessibility checks; email sent with verified sender.
- Load/abuse: Rate limit protection, spam payloads.

---

## Priority Fix List
1) Remove IP/User-Agent from emails and logs (privacy) – route.js.
2) Fail fast when RESEND_API_KEY missing or persist to Sheets fallback.
3) Add modal accessibility (focus trap, ESC). 
4) Parse and display server-side validation errors in client.
5) Use verified sender + env-configured recipient.
6) Add basic rate limiting and honeypot.

End of report.