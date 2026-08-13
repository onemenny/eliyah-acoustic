import { defaultLocale } from '@/i18n';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const target = `${basePath}/${defaultLocale}/`;

// Canonical routes are /en/ and /he/. This is the bare `/` entry point: under
// `output: 'export'` there is no server to issue a 3xx and next/navigation's
// redirect() fails at build time, so the hop is a meta refresh plus a canonical
// pointing at the default locale. Renders its own document shell because the
// root layout is a pass-through (see app/layout.tsx).
export default function RootRedirect() {
  return (
    <html lang={defaultLocale} dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <link rel="canonical" href={target} />
        <title>Eliyah Acoustic</title>
        <style>{'body{margin:0;background:#181310;color:#e9e2d3;font-family:sans-serif}'}</style>
      </head>
      <body>
        <a href={target}>Eliyah Acoustic</a>
      </body>
    </html>
  );
}
