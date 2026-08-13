# Eliyah Acoustic Project Status

Last updated: 2026-08-13 (issues #2–#11, #13, #14 — full Phase 1 homepage, catalog, Formspree wiring, and GitHub Pages deploy — built, reviewed, merged to main, and confirmed live)

## Where things stand

- **Requirements doc**: `docs/Unified Requirements for Coding Agent.md` is complete and is the source of truth for scope, architecture, brand/design fidelity, and phasing. It supersedes `speakers-ecommerce-scope.md` (kept in the repo as reference material — original e-commerce configurator scope) and the design handoff's own README (kept as the canonical *visual* reference for Phase 1 — see the Unified doc's Executive Overview).
- **Backlog**: 14 GitHub issues (#1–#14, all labeled `phase-1`). #1–#11, #13, #14 are closed/Done. #12 (real product data) remains open, blocked on the user. Full dependency graph is on each issue's "Depends on" section.
- **Project board**: "Eliyah Acoustic Pipeline" (project #2, https://github.com/users/onemenny/projects/2). `Status` field columns: `Backlog → Spec'd → Building → Reviewing → Done`. #1–#11, #13, #14 are `Done`; #12 is `Backlog` (blocked).
- **Agent pipeline**: `.claude/agents/` (`orchestrator`, `builder-agent`, `reviewer-agent`, `backlog-agent`) defines a lightweight 2-role Builder↔Reviewer loop, but this harness does not recognize project-scoped `.claude/agents/*.md` files as valid `Agent`-tool `subagent_type`s — spawning `subagent_type: "orchestrator"` (or `builder-agent`/`reviewer-agent`) errors with "not found". The working pattern is to spawn `subagent_type: "general-purpose"` and paste the relevant `.claude/agents/*.md` role body verbatim into the prompt. A second quirk: notifications from an orchestrator's *nested* sub-spawns (Builder/Reviewer) land on the top-level session instead of waking the orchestrator, so the top-level session must manually relay each nested report to the orchestrator via `SendMessage` to keep the pipeline moving. This pattern ran cleanly across 12 consecutive issue pipelines (#2–#11, #13, #14) in one autonomous session.
- **Code**: The full Phase 1 site is live on `main`. All 17 §5.4 homepage sections built (Nav/Hero through Footer, issues #2–#9); product catalog listing (`/products`) and detail (`/products/[slug]`) pages built against 5 placeholder products (issues #10–#11); homepage and product-page CTAs wired to a shared Formspree-backed inquiry dialog with product-context passthrough (issue #13); GitHub Pages CI/CD workflow and basePath-correct asset paths in place (issue #14). Shared primitives established along the way: `lib/scrollFx.ts` (RAF-throttled scroll), `lib/reveal.ts` (IntersectionObserver reveal-on-enter), `lib/anchorScroll.ts` (JS-driven anchor scroll), `lib/basePath.ts` (GitHub Pages subpath helper), `lib/formspree.ts`, `lib/formatPrice.ts`. Fonts (Fraunces/Manrope/Heebo) are self-hosted under `assets/fonts/` via `next/font/local` rather than `next/font/google` — see Deploy note below.
- **Deploy**: **Site is live and confirmed working** at https://onemenny.github.io/eliyah-acoustic/. GitHub Pages enabled (Settings → Pages → Source: GitHub Actions, done via `gh api`). `.github/workflows/deploy.yml` builds and publishes on push to `main`; latest run (commit `cc71494`) succeeded end-to-end (build + deploy), verified with a live browser check of both `/he/` (Hebrew renders correctly in Heebo, RTL layout, LTR chrome) and `/en/products/octagon/` (image/pricing/CTAs render correctly with basePath-prefixed assets). A CI-only build failure was found and fixed post-#14-close: `next/font/google` fetched font CSS from Google at build time, and a stale edge-cached response 404'd on a Manrope file — reproducible on GitHub's fresh-checkout runners but masked locally by next/font's build cache. Fixed by vendoring all three font families as `.woff2` files and switching to `next/font/local`, eliminating the build-time network dependency entirely.
- **Repo**: `onemenny/eliyah-acoustic` (public), created and pushed 2026-08-13. Commits go straight to `main` (no branch/PR step) — confirmed with the user as the intended flow (solo dev).

## Known open items (see Unified doc §7 for full detail)

1. **5 catalog product models' images/details are pending from the user.** Blocks issue #12 and Phase 1 "Done" — the catalog listing/detail pages are fully built and functional against 5 placeholder products (reusing existing studio photography as stand-ins); `data/products.ts` is explicitly marked as throwaway, to be wholesale-replaced (not extended) once real content arrives.
2. **Canonical currency** (ILS vs USD) — ILS used as placeholder throughout; not yet confirmed as final.
3. **About-section team photo** — currently a placeholder product shot, not a real portrait. `SHOW_TEAM` flag (in `components/homepage/About.tsx`) defaults `false`, gating the team row off entirely until real bios/photos are supplied — flip the flag once ready, no other code changes needed.
4. **Wordmark vector logo** — currently set in type; a real vector lockup is needed from the client eventually (not a Phase 1 blocker).
5. **Formspree account not yet created.** `NEXT_PUBLIC_FORMSPREE_FORM_ID` ships unset (see `.env.example`). Until the user creates a Formspree form and sets that env var (locally + in the GitHub Pages deploy workflow), the consultation dialog's submissions will show the localized error state — everything else (validation, payload shape, success/error UI, bilingual/RTL, accessibility) is built and verified client-side.
6. **Hero's Hebrew heading doesn't use `--head-scale`/`--head-lh-loose`** — minor HE/EN heading-size inconsistency vs. every later section; cosmetic, non-blocking, flagged since issue #3.
7. **Font preload payload grew slightly** (9 static `.woff2` files vs. Google's variable-font delivery, from the CI font-fetch fix). Manrope could cleanly collapse to one variable file; Heebo cannot without a real `fonttools`/`pyftsubset` subset-merge job (gstatic splits variable Heebo by script, and `next/font/local` has no per-`src` `unicode-range`) — real work if picked up, not a quick tweak. Not yet filed as its own issue.

## Phase roadmap (see Unified doc §2 for full detail)

1. **Phase 1 — Marketing homepage + 5-model catalog.** GitHub Pages (static export). No configurator, no checkout. **Site is built, deployed, and live; blocked on real product data (#12) and a Formspree account (item 5 above) for a true "Done" per §2.1.**
2. **Phase 2 — Configurator upgrade.** Live per-variant pricing for the 5 models, still quote-driven (no checkout). Migrate off GitHub Pages onto Vercel + custom domain. Legal pages (Terms/Privacy/Refund) land here.
3. **Phase 3 — E-commerce checkout.** Stripe + Tranzila, server-side price recomputation, webhook-confirmed orders, billing-country payment routing.
4. **Phase 4 — intentionally undefined.**

## Next step candidates

- User creates a Formspree account/form and sets `NEXT_PUBLIC_FORMSPREE_FORM_ID` (locally + in CI) so real inquiry submissions work end-to-end.
- Once the user supplies the 5 product models' images/copy, run issue #12 to replace `data/products.ts` wholesale with real content.
- Optional: file a follow-up issue for the font-preload-size item (open item 7) if it's worth prioritizing.

## Maintenance note

Update this file whenever the pipeline advances an issue (spec'd/building/reviewing/done) or new issues are seeded. Keep entries to current-state facts and open risks/decisions — retry-cycle blow-by-blows and file-by-file build logs belong in commit messages and git history, not here. When a risk resolves, delete its entry rather than appending a "RESOLVED" note next to the original text.
