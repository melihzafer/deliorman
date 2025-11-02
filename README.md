# Deliorman Restaurant Website

## Overview

A simple informative website for Deliorman Restaurant built with Next.js. This static website showcases the restaurant's menu, location, hours, and contact information.

## Features

- Restaurant information (about, location, hours)
- Complete menu with categories and prices
- Photo gallery
- Contact details

## Tech Stack

- Next.js 14 (App Router)
- SCSS (modular styles) + small Bootstrap plugin CSS
- Swiper, Font Awesome
- Deployed on Vercel

## Getting Started

### Prerequisites

- Node.js (version 16+)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/deliorman-restaurant.git
cd deliorman-restaurant
```

1. Install dependencies:

```bash
npm install
# or
yarn install
```

1. Start the development server:

```bash
npm run dev
# or
yarn dev
```

1. Open <http://localhost:3000> in your browser.

## Project Structure

```text
deliorman-website/
├── app/                 # Next.js App Router
│   ├── about/           # About page
│   ├── contact/         # Contact page
│   ├── menu/            # Menu page
│   └── page.js          # Homepage
├── components/          # React components
├── public/              # Images and static assets
└── styles/              # CSS styles
```

## Deployment

Deploy to Vercel by connecting your GitHub repository.

## Content Updates

Edit the menu and other content directly in the source files:

- Menu items: `app/menu/data.js`
- Restaurant info: `app/about/data.js`
- Contact details: `app/contact/page.js`

No CMS or backend is required as this is a static informative website.

## Mobile-first design (recent update)

- Base typography, spacing, and buttons are now mobile-first with progressive enhancement at 790px and 992px breakpoints.
- Buttons auto-center on small screens and use compact heights.
- Section paddings and large margins are reduced on mobile to avoid cramped layouts.

Adjust tokens in `src/app/_styles/scss/_common.scss` if you need different scales:

- Typography: base sizes and `@media (min-width: 790px|992px)` overrides
- Spacing: `.tst-mb-*`, `.tst-p-*` utilities with breakpoint scaling
- Buttons: `.tst-btn` base height/padding and mobile centering rules
