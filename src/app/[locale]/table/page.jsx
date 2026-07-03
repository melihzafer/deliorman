import { getLocale } from "next-intl/server";
import MasaClient from "../../masa/MasaClient";

export const metadata = {
  title: "Меню • Делиорман",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TablePage() {
  const locale = await getLocale();

  // Headings use Playfair Display, already self-hosted globally by the root
  // layout (next/font, incl. Cyrillic) — no extra render-blocking font request.
  return <MasaClient initialLocale={locale} />;
}
