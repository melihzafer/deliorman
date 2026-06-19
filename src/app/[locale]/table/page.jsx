import { getLocale } from "next-intl/server";
import MasaClient from "../../masa/MasaClient";

export const metadata = {
  title: "Меню • Делиорман",
  robots: { index: false, follow: false },
  // Blackletter + old-style serif for newspaper masthead
  other: {
    "preconnect-fonts": "https://fonts.googleapis.com",
  },
};

export const dynamic = "force-dynamic";

export default async function TablePage() {
  const locale = await getLocale();

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap"
      />
      <MasaClient initialLocale={locale} />
    </>
  );
}
