import type { ReactNode } from 'react';

// Pass-through root layout. <html> carries a per-locale `lang`/`dir`, so the
// document shell is rendered by app/[locale]/layout.tsx (and, for the bare `/`
// redirect stub, by app/page.tsx itself) rather than here.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
