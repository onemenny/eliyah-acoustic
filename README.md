# Eliyah Acoustic

Marketing + catalog site for **Eliyah Acoustic**, a studio that designs, hand-builds, and tunes
custom architectural sound systems (projects ₪70,000–₪400,000+). Next.js (App Router) +
TypeScript, bilingual English/Hebrew with RTL support.

For scope, architecture, brand/design fidelity requirements, and phasing, see
`docs/Unified Requirements for Coding Agent.md`. For current project status, see `docs/Status.md`.

## Reference material

- `design_handoff_eliyah_homepage/` — the canonical visual reference for the Phase 1 homepage
  (high-fidelity HTML/CSS prototype + design tokens). Not production code — see its own README
  for what to port vs. not.
- `resources/Eliyah_Acoustic.docx` — the brand doc (vision, positioning, tone, team, project
  economics) both the homepage design and the unified requirements doc are built from.
- `speakers-ecommerce-scope.md` — the original e-commerce configurator scope; superseded by
  `docs/Unified Requirements for Coding Agent.md`, kept for reference (its data model and payment
  architecture are carried forward into later phases).

## Phase roadmap

1. **Phase 1 — Marketing homepage + 5-model catalog.** Static export, deployed on GitHub Pages.
   No configurator, no checkout. **Current phase.**
2. **Phase 2 — Configurator upgrade.** Live per-variant pricing, migrate to Vercel + custom domain.
3. **Phase 3 — E-commerce checkout.** Stripe + Tranzila.
4. **Phase 4 — undefined.**

## Development

No code exists yet as of this writing. Once the Next.js project is scaffolded (see the unified
doc's §3.4 repo structure):

```bash
npm install
npm run dev
```

## Agent pipeline

This repo uses a small Claude Code agent pipeline (mirroring the pattern in the sibling `LangHUD`
project, scaled down) to build against the unified requirements doc:

- `/seed-backlog "Phase N"` — decompose a phase into GitHub issues on the
  [Eliyah Acoustic Pipeline](https://github.com/users/onemenny/projects/2) board.
- `/build-feature <request or issue>` — run the `orchestrator` → `builder-agent` → `reviewer-agent`
  pipeline end-to-end for one backlog item.

See `.claude/agents/` for each agent's role.
