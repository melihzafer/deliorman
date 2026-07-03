export type Locale = "bg" | "tr" | "en";
export type SessionState = "loading" | "active" | "blocked";

export interface LocalizedText {
  bg?: string;
  tr?: string;
  en?: string;
}

export interface QrMenuItem {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  amount: string;
  price: number | null;
  allergens?: string[];
}

export interface QrMenuCategory {
  id: string;
  order: number;
  title: LocalizedText;
  description: LocalizedText;
  items: QrMenuItem[];
}

export interface QrMenuData {
  version: number;
  restaurantName: string;
  currency: string;
  categories: QrMenuCategory[];
}

export type MasaStyles = { readonly [key: string]: string };
export type WaiterFeedback = { type: "success" | "error"; text: string } | null;
