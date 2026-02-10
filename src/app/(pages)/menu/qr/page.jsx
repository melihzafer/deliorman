import React from "react";
import MenuData from "@data/menu.json";
import QrMenuMagazine from "@components/qr-menu/QrMenuMagazine";

export const metadata = {
  title: "QR Меню",
  description: "Сканирайте QR кода и разгледайте пълното меню на ресторант Делиорман.",
  robots: { index: false },
};

export default function QrMenuPage() {
  return (
    <QrMenuMagazine
      categories={MenuData.categories}
      restaurantName={MenuData.restaurant_name}
    />
  );
}
