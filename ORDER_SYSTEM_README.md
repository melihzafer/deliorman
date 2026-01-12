# Serverless Order System - Deliorman Restaurant

## Overview

A complete serverless order management system built for Deliorman restaurant with the following features:

- **No Database Required**: Orders are stored in Stripe metadata and sent to Telegram
- **Dual Payment Methods**: Cash on delivery and card payments via Stripe
- **Real-time Notifications**: Instant Telegram alerts with visual differentiation
- **Provider-Agnostic Architecture**: Easy migration from Stripe to Revolut or other providers
- **Cart Management**: Zustand-based persistent cart with localStorage
- **Form Validation**: Zod schema validation with Bulgarian phone number format

## Architecture

### System Flow

```
User → Cart (Zustand) → Checkout Form (Zod Validation) → API Route
                                                              ↓
                                            ┌─────────────────┴─────────────────┐
                                            ↓                                   ↓
                                    Cash Payment                        Card Payment
                                            ↓                                   ↓
                                    Telegram Notification              Stripe Session
                                    (⚠️ CALL TO CONFIRM)                      ↓
                                            ↓                           Payment Success
                                    Success Page                               ↓
                                                                      Webhook Handler
                                                                               ↓
                                                                   Telegram Notification
                                                                   (✅ START COOKING)
                                                                               ↓
                                                                        Success Page
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   │   └── route.ts              # Main checkout endpoint
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts          # Stripe webhook handler
│   ├── (pages)/
│   │   ├── cart/
│   │   │   └── page.jsx              # Cart page with Zustand
│   │   ├── checkout/
│   │   │   └── page.jsx              # Checkout page
│   │   └── success/
│   │       └── page.tsx              # Order confirmation page
│   ├── _components/
│   │   ├── forms/
│   │   │   └── CheckoutForm.jsx      # Checkout form with validation
│   │   └── products/
│   │       ├── CartItem.jsx          # Cart item component
│   │       ├── ProductItem.jsx       # Product display with add to cart
│   │       └── ProductButtons.jsx    # Add to cart buttons
│   └── _layouts/
│       └── cart/
│           └── MiniCart.jsx          # Mini cart sidebar
├── lib/
│   ├── payment/
│   │   ├── types.ts                  # Payment provider interfaces
│   │   ├── index.ts                  # Payment factory
│   │   └── stripe.ts                 # Stripe implementation
│   ├── telegram.ts                   # Telegram bot notifications
│   └── validations/
│       └── checkout.ts               # Zod validation schemas
└── store/
    └── cart-store.ts                 # Zustand cart store
```

## Setup Instructions

### 1. Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Required variables:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...                    # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...                  # Webhook signing secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...   # Public key for client

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...             # From @BotFather
TELEGRAM_CHAT_ID=123456789                       # Your chat/channel ID

# Application URL
NEXT_PUBLIC_URL=http://localhost:3000            # Change for production

# Payment Provider (optional)
PAYMENT_PROVIDER=stripe                          # Defaults to 'stripe'
```

### 2. Stripe Setup

1. **Create Stripe Account**: Go to [stripe.com](https://stripe.com)
2. **Get API Keys**: Dashboard → Developers → API Keys
3. **Setup Webhook**:
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select event: `checkout.session.completed`
   - Copy the webhook signing secret

### 3. Telegram Bot Setup

1. **Create Bot**:
   ```
   1. Message @BotFather on Telegram
   2. Send /newbot
   3. Follow instructions
   4. Copy the bot token
   ```

2. **Get Chat ID**:
   ```
   1. Add your bot to a group/channel
   2. Send a message
   3. Visit: https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   4. Find "chat":{"id": YOUR_CHAT_ID}
   ```

### 4. Install & Run

```bash
# Dependencies already installed during setup
npm run dev
```

Visit `http://localhost:3000`

## Features

### 1. Cart Management (Zustand)

- Persistent cart with localStorage
- Add/remove items
- Update quantities (1-10)
- Real-time subtotal calculation
- Cart count badge

### 2. Checkout Flow

**Cash on Delivery:**
1. User fills form
2. Validates Bulgarian phone: `+359` or `08x` format
3. Sends order to Telegram with ⚠️ warning
4. Redirects to success page

**Card Payment:**
1. User fills form
2. Creates Stripe Checkout session
3. Redirects to Stripe payment page
4. On success, webhook sends ✅ notification to Telegram
5. Redirects to success page

### 3. Telegram Notifications

**Cash Order (⚠️ Yellow Alert):**
```
⚠️ НОВА ПОРЪЧКА С НАЛОЖЕН ПЛАТЕЖ ⚠️
-----------------------------
📞 ОБАДЕТЕ СЕ ЗА ПОТВЪРЖДЕНИЕ: +359 88 123 4567
-----------------------------
👤 Иван Петров
📍 ул. Александър Стамболийски 15

🛒 Поръчка:
- 2x Адана Кебаб
- 1x Айран

📝 Бележка: Без лук

💵 Обща сума: 25.50 лв.

‼️ ВАЖНО: Обадете се на клиента ПРЕДИ да приготвите поръчката!
```

**Card Order (✅ Green Confirmation):**
```
✅ ПЛАТЕНА ПОРЪЧКА (STRIPE) ✅
-----------------------------
🚀 ЗАПОЧНЕТЕ ПРИГОТВЯНЕТО
-----------------------------
👤 Иван Петров
📍 ул. Александър Стамболийски 15
📞 +359 88 123 4567

🛒 Поръчка:
- 2x Адана Кебаб
- 1x Айран

💳 Платено: 25.50 лв.
🆔 Номер на поръчка: ORD-1704567890-ABC123
```

### 4. Validation

Bulgarian phone number validation with Zod:
- Accepts: `+35987XXXXXXX` or `087XXXXXXX`
- Prefixes: 87, 88, 89 (Bulgarian mobile)
- Minimum address length: 10 characters
- Minimum name length: 2 characters

## Testing

### Test Cash Order

1. Add items to cart from menu
2. Go to checkout
3. Fill form with test data:
   - Name: `Иван Петров`
   - Phone: `0888123456`
   - Address: `ул. Александър Стамболийски 15`
4. Select "Наложен платеж"
5. Submit → Check Telegram for ⚠️ notification

### Test Card Payment

1. Add items to cart
2. Go to checkout
3. Fill form
4. Select "Банкова карта"
5. Use Stripe test card: `4242 4242 4242 4242`
6. Any future expiry, any CVC
7. Check Telegram for ✅ notification

## Future Provider Migration

To switch from Stripe to Revolut:

1. **Create Revolut Provider**:
   ```typescript
   // src/lib/payment/revolut.ts
   export class RevolutProvider implements PaymentProvider {
     // Implement interface methods
   }
   ```

2. **Update Factory**:
   ```typescript
   // src/lib/payment/index.ts
   if (process.env.PAYMENT_PROVIDER === 'revolut') {
     return new RevolutProvider();
   }
   ```

3. **Update Environment**:
   ```env
   PAYMENT_PROVIDER=revolut
   REVOLUT_API_KEY=...
   ```

## Security Notes

1. **Webhook Verification**: Stripe signatures are verified before processing
2. **Validation**: All inputs validated server-side with Zod
3. **HTTPS Required**: Webhooks only work over HTTPS in production
4. **Environment Variables**: Never commit `.env.local` to git

## Troubleshooting

### Webhook Not Receiving Events

1. Check webhook URL is publicly accessible
2. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
3. Check Stripe dashboard → Webhooks → Recent deliveries

### Telegram Not Sending

1. Verify `TELEGRAM_BOT_TOKEN` is correct
2. Ensure bot is added to chat/channel
3. Check `TELEGRAM_CHAT_ID` is correct
4. View server logs for error messages

### Cart Not Persisting

1. Check browser localStorage is enabled
2. Clear browser cache and try again
3. Ensure Zustand persist middleware is working

## Production Deployment

1. **Update Environment Variables**:
   ```env
   NEXT_PUBLIC_URL=https://deliorman.bg
   STRIPE_SECRET_KEY=sk_live_...
   ```

2. **Configure Webhook**:
   - Update Stripe webhook URL to production domain
   - Use live mode webhook secret

3. **Test End-to-End**:
   - Place test orders
   - Verify Telegram notifications
   - Check payment flow

## Support

For issues or questions:
- Check console logs for errors
- Review Stripe dashboard for payment status
- Verify Telegram bot configuration
- Check webhook delivery logs

---

**Built with:** Next.js 16, Zustand, Zod, Stripe, Telegram Bot API
