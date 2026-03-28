// ─── Menu ────────────────────────────────────────────────────────────────────

export interface MenuItem {
  title: string;
  amount: string;
  price: number;
  text: string;
}

export interface MenuCategory {
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  items: MenuItem[];
}

export interface MenuData {
  restaurant_name: string;
  categories: MenuCategory[];
}

// ─── App / Site Config ───────────────────────────────────────────────────────

export interface NavMenuItem {
  label: string;
  link: string;
  children?: NavMenuItem[];
}

export interface ImageRef {
  image?: string;
  url?: string;
  alt: string;
}

export interface FooterContactItem {
  label: string;
  value: string;
}

export interface FooterSection<T = unknown> {
  title: string;
  items?: T[];
  text?: string;
  button?: { link: string; label: string };
}

export interface SocialLink {
  link: string;
  title: string;
  icon: string;
}

export interface AppConfig {
  settings: {
    siteName: string;
    siteDescription: string;
    bgImage: string;
    formspreeURL: string;
    mailchimp: { url: string; key: string };
    mapbox: {
      style: string;
      zoom: number;
      long: number;
      lat: number;
    };
    openTable: {
      actionUrl: string;
      restaurantID: string;
      geoID: string;
      lang: string;
    };
    perPage: number;
  };
  header: {
    logo: ImageRef;
    menu: NavMenuItem[];
    onepage: NavMenuItem[];
  };
  footer: {
    logo: ImageRef;
    about: FooterSection;
    contact: FooterSection<FooterContactItem>;
    gallery: FooterSection<ImageRef>;
    legal: { links: { label: string; link: string }[] };
    copy: string;
  };
  social: SocialLink[];
}

// ─── Schedule ────────────────────────────────────────────────────────────────

export interface ScheduleTime {
  hours: string;
  minutes: string;
}

export interface ScheduleDay {
  label: string;
  from: ScheduleTime;
  to: ScheduleTime;
}

export interface ScheduleData {
  image: ImageRef;
  subtitle: string;
  title: string;
  description: string;
  button1: { link: string; label: string };
  button2: { link: string; label: string };
  items: ScheduleDay[];
}

// ─── Blog / Posts ────────────────────────────────────────────────────────────

export interface PostFrontmatter {
  title: string;
  date: string;
  image: string;
  categories?: string[];
  tags?: string[];
  author: string;
  authorAvatar: string;
  short: string;
  [key: string]: unknown;
}

export interface PostEntry {
  id: string;
  content: string;
  data: PostFrontmatter;
}

export interface PostSummary extends PostFrontmatter {
  id: string;
}

// ─── Forms ───────────────────────────────────────────────────────────────────

export interface ReservationFormData {
  first_name: string;
  last_name: string;
  phone: string;
  person: string;
  date: string;
  time: string;
  message?: string;
  privacy_consent: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

// ─── Phone Validation ────────────────────────────────────────────────────────

export interface PhoneValidationOptions {
  emptyMessage?: string;
}

export interface PhoneValidationResult {
  ok: boolean;
  normalized: string;
  message: string;
}
