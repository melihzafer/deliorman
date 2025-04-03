# Deliorman Restaurant Website

## Overview
A simple informative website for Deliorman Restaurant built with Next.js. This static website showcases the restaurant's menu, location, hours, and contact information.

## Features
- Restaurant information (about, location, hours)
- Complete menu with categories and prices
- Photo gallery
- Contact details

## Tech Stack
- Next.js
- CSS/Tailwind CSS
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

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
```
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
