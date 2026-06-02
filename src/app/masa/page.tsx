import { redirect } from 'next/navigation';

export const metadata = {
  title: 'QR Меню • Делиорман',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

interface MasaPageProps {
  searchParams?: Promise<SearchParams>;
}

function normalizeRedirectLocale(value: string | string[] | undefined): 'bg' | 'en' | 'tr' {
  const locale = Array.isArray(value) ? value[0] : value;
  if (locale === 'en' || locale === 'tr') return locale;
  return 'bg';
}

function appendQueryValue(params: URLSearchParams, key: string, value: string | string[] | undefined) {
  if (typeof value === 'string') {
    params.append(key, value);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => params.append(key, entry));
  }
}

export default async function MasaPage({ searchParams }: MasaPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const locale = normalizeRedirectLocale(resolvedSearchParams.lang);
  const targetPath = locale === 'bg' ? '/table' : `/${locale}/table`;
  const targetParams = new URLSearchParams();

  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (key !== 'lang') appendQueryValue(targetParams, key, value);
  });

  const query = targetParams.toString();
  redirect(query ? `${targetPath}?${query}` : targetPath);
}
