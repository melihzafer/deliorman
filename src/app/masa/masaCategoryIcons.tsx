import React from "react";
import {
  Coffee,
  Leaf,
  Soup,
  Pizza,
  Flame,
  Fish,
  UtensilsCrossed,
  Sparkles,
  Cookie,
  Beer,
  Utensils,
  Wine,
  GlassWater,
  Martini,
  Info,
} from "lucide-react";

/** Inline burger glyph — lucide has no dedicated burger icon. */
function BurgerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 11c0-4 4-6 9-6s9 2 9 6H3ZM2 15h20M3 18h18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <path d="M5 15a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
    </svg>
  );
}

const categoryIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "hot-beverages": Coffee,
  salads: Leaf,
  "hot-appetizers": UtensilsCrossed,
  "soups-sandwiches": Soup,
  pizzas: Pizza,
  grill: Flame,
  "saj-fish-specialties": Fish,
  burgers: BurgerIcon,
  "new-specialties": Sparkles,
  "cold-appetizers-sides": Leaf,
  "nuts-desserts": Cookie,
  rakia: GlassWater,
  wines: Wine,
  "beer-cider-other-drinks": Beer,
  "whiskey-vodka": Martini,
  allergens: Info,
};

export function getCategoryIcon(categoryId: string): React.ComponentType<React.SVGProps<SVGSVGElement>> {
  return categoryIcons[categoryId] || Utensils;
}
