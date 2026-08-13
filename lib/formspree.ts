// Formspree endpoint resolution (docs §2.1/§7 item 4, issue #13).
//
// Formspree needs no backend of its own — the client POSTs a `FormData`
// straight to `https://formspree.io/f/<form-id>` and Formspree relays it by
// email. That fits `output: 'export'` (docs §3.1): no `app/api/` route, no
// server component with per-request data.
//
// IMPORTANT — READ BEFORE DEPLOYING: no real Formspree form exists yet. This
// repo does not and cannot contain a real form id (an agent can't sign up
// for a third-party account). Before this goes live:
//   1. Create a free account at https://formspree.io
//   2. Create a form and copy its form id (the segment after `/f/` in the
//      endpoint Formspree gives you)
//   3. Set `NEXT_PUBLIC_FORMSPREE_FORM_ID` to that id — locally in
//      `.env.local` for `next dev`/`next build`, and as a build-time env var
//      in whatever CI workflow produces the GitHub Pages static export
//      (issue #14) — `NEXT_PUBLIC_*` vars are inlined at build time under
//      `output: 'export'`, there is no runtime env access to fall back on.
// Until that's done, `getFormspreeEndpoint()` returns `null` and
// ConsultationDialog shows a "not configured yet" error instead of firing a
// request that would just 404.
export function getFormspreeEndpoint(): string | null {
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
  if (!formId) return null;
  return `https://formspree.io/f/${formId}`;
}
