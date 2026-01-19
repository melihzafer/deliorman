# 🍽️ Restaurant Deliorman

> A modern, fully responsive restaurant website for Deliorman Restaurant located in Samuil, Razgrad, Bulgaria. Features online table reservations, interactive menu showcase, and elegant UI/UX design.

[![Live Published](https://img.shields.io/badge/demo-live-success)](https://restorantdeliorman.com)
[![Built with](https://img.shields.io/badge/built%20with-React-61dafb)](https://reactjs.org/)
[![Powered by](https://img.shields.io/badge/powered%20by-Melih%20Hyusein-blue)](https://melihzafer.netlify.app)

## ✨ Features

- **📅 Online Reservations** - Interactive table booking system with date/time selection
- **🍴 Digital Menu** - Comprehensive menu display with specialty dishes and pricing
- **📱 Fully Responsive** - Optimized for mobile, tablet, and desktop devices
- **🎨 Modern UI/UX** - Clean design with smooth animations and transitions
- **🖼️ Photo Gallery** - Showcase restaurant ambiance and signature dishes
- **📍 Location Integration** - Contact information and directions
- **🕒 Business Hours Display** - Real-time operating hours visibility
- **🌐 Multilingual Support** - Content in Bulgarian for local audience

## 🛠️ Tech Stack

- **Frontend Framework:** React / Next.js
- **Styling:** CSS3 / Tailwind CSS / Styled Components
- **Form Handling:** React Hook Form / Formik
- **Deployment:** Vercel / Netlify
- **Analytics:** Google Analytics (optional)

## ⚙️ Environment Variables

This project requires several environment variables to be configured. Create a `.env` file in the root directory based on `.env.example`.

### Required Variables (Server-side)

- `RESEND_API_KEY` - API key for Resend email service
- `TELEGRAM_BOT_TOKEN` - Telegram bot token from BotFather
- `TELEGRAM_RESERVATIONS_CHAT_ID` - Telegram chat/channel ID for reservation notifications
- `TELEGRAM_DISABLE` - Set to `true` to disable Telegram notifications (useful for local development)

### Optional Variables

- `NEXT_PUBLIC_SITE_URL` - Your site's production URL (e.g., https://restorantdeliorman.com)
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` - Mapbox token for map integration
- `NEXT_PUBLIC_OPENTABLE_RESTAURANT_ID` - OpenTable restaurant ID
- `NEXT_PUBLIC_FORMSPREE_URL` - Formspree form endpoint
- `NEXT_PUBLIC_MAILCHIMP_URL` - Mailchimp subscription URL
- `NEXT_PUBLIC_MAILCHIMP_KEY` - Mailchimp API key
- `RESERVATION_RATE_WINDOW_SECONDS` - Time window for rate limiting (default: 86400)
- `RESERVATION_RATE_MAX` - Maximum reservations per window (default: 5)

### Setup Instructions

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual API keys and tokens in the `.env` file

3. **Important:** Never commit the `.env` file to version control. It's already in `.gitignore` for your protection.

## 🚀 Key Sections

### Hero Section
- Dynamic slider with call-to-action buttons
- Direct links to menu and reservation system
- Eye-catching visuals of signature dishes

### Menu Showcase
- Шиш Делиорман (Signature kebab specialty)
- Агнешки шиш (Lamb kebab)
- Телешко печено (Traditional veal roast)
- Full menu categorization

### About Section
- Restaurant story and philosophy
- Quality commitment highlights
- Team expertise showcase

### Reservation System
- Real-time availability checking
- Guest count selection (1-6+ people)
- Date and time picker integration
- Additional notes field

## 📊 Website Stats

- **Daily Visitors:** 500+ active users
- **Monthly Catering Services:** 30+ events
- **Customer Satisfaction:** 95% positive reviews
- **Awards & Recognition:** Multiple local accolades

## 📸 Screenshots

![Homepage](./screenshots/homepage.png)
![Menu](./screenshots/menu.png)

## 🎯 Project Goals

This project demonstrates:
- Modern web development best practices
- Responsive design implementation
- User-centric interface design
- Performance optimization
- SEO-friendly structure
- Accessibility standards compliance

## 📞 Contact & Links

- **Live Website:** [restorantdeliorman.com](https://restorantdeliorman.com)
- **Facebook:** [Restaurant Deliorman](https://www.facebook.com/profile.php?id=100063542858187)
- **Phone:** +359 89 4766273
- **Email:** restaurantdeliorman@gmail.com
- **Location:** с. Самуил, ул. "Хаджи Димитър" №6, обл. Разград

## 👨‍💻 Developer

**Melih Zafer Hyusein**
- Portfolio: [melihzafer.netlify.app](https://portfolio.melihzafer.me)
- GitHub: [@melihzafer](https://github.com/melihzafer)
- Company: OMNI Tech Solutions

## 📝 License

© Restaurant Deliorman. All rights reserved.

---

**Built with ❤️ for local businesses in Bulgaria**
