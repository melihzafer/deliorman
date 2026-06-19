'use client';

import dynamic from 'next/dynamic';

// These widgets are non-critical UI overlays. By lazy-loading them inside a
// client boundary we keep the root layout's server-rendered HTML lean and
// defer downloading framer-motion bundles until the browser is idle.
const ScrollProgress = dynamic(
  () => import("@components/common/ScrollProgress"),
  { ssr: false }
);
const BackToTop = dynamic(
  () => import("@components/common/BackToTop"),
  { ssr: false }
);
const FeedbackFAB = dynamic(
  () => import("@components/ui/FeedbackFAB").then(mod => ({ default: mod.FeedbackFAB })),
  { ssr: false }
);

export default function LazyLayoutWidgets() {
  return (
    <>
      <ScrollProgress />
      <FeedbackFAB />
      <BackToTop />
    </>
  );
}
