# Ресторант Делиорман - Website

Modern restaurant website built with Next.js 14, featuring online menu, reservations, gallery, and blog.

## 🚀 Tech Stack

- **Framework:** Next.js 14.2+ (App Router)
- **Language:** JavaScript (TypeScript migration in progress)
- **Styling:** TailwindCSS + SCSS
- **Fonts:** Next.js Font Optimization (Josefin Sans, Playfair Display)
- **Deployment:** Vercel
- **Email:** Resend
- **Maps:** Mapbox GL
- **Animations:** Swiper, react-modal-video

## 📋 Prerequisites

- Node.js 18.17 or later
- npm or yarn

## 🛠️ Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd deliorman-website-nextjs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Required variables:
   - `RESEND_API_KEY` - For email functionality
   - `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` - For map display

4. **Run development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run analyze` - Analyze bundle size

## 🎨 Key Features

- ✅ Responsive design
- ✅ Multi-page menu system
- ✅ Online reservation forms
- ✅ Image gallery with lightbox
- ✅ Blog with Markdown support
- ✅ Contact form with email integration
- ✅ SEO optimized with metadata
- ✅ Structured data (JSON-LD)
- ✅ Security headers configured
- ✅ Image optimization with next/image

## 🔧 Configuration

### Update Site Information

Edit `src/data/app.json`:
- Site name, description
- Contact information
- Social media links
- Mapbox coordinates
- Menu items

### Domain Configuration

Update `siteUrl` / `baseUrl` in:
- `src/app/layout.jsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/app/_components/StructuredData.jsx`

## 🚢 Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
4. Deploy

## ⚡ Performance Optimizations

- Next.js Image Optimization (automatic WebP)
- Lazy loading for below-fold content
- Font optimization with next/font
- Security headers configured
- Bundle analyzer available (`npm run analyze`)
- Static generation where possible

## 📝 Remaining Tasks

- [ ] Complete image migration to next/image
- [ ] Add TypeScript to all components
- [ ] Implement i18n for multi-language
- [ ] Add unit tests
- [ ] Create proper OG image (1200x630)
- [ ] Update all TODO comments in code

## 📄 License

[Add your license here]
