# Eliyah Acoustic Project Status

Last updated: 2026-08-13 (kickoff — requirements doc, repo, board, and agent pipeline just created; no code written yet)

## Where things stand

- **Requirements doc**: `docs/Unified Requirements for Coding Agent.md` is complete and is the source of truth for scope, architecture, brand/design fidelity, and phasing. It supersedes `speakers-ecommerce-scope.md` (kept in the repo as reference material — original e-commerce configurator scope) and the design handoff's own README (kept as the canonical *visual* reference for Phase 1 — see the Unified doc's Executive Overview).
- **Backlog**: empty. No GitHub issues created yet. Run `/seed-backlog "Phase 1"` to decompose Phase 1 (marketing homepage + 5-model catalog) into issues.
- **Project board**: "Eliyah Acoustic Pipeline" (project #2, https://github.com/users/onemenny/projects/2). `Status` field columns: `Backlog → Spec'd → Building → Reviewing → Done`. Currently empty.
- **Agent pipeline**: built, not yet run. `.claude/agents/` — `orchestrator`, `builder-agent`, `reviewer-agent`, `backlog-agent` — plus skills `/build-feature` and `/seed-backlog`. This is a lightweight version of the LangHUD pipeline (2 working roles instead of 4) since this is a much smaller Next.js/React site without a heavy native-app test suite to drive.
- **Code**: none yet. Repo is currently just the brand doc, the homepage design handoff, and reference images/scope doc from the initial import commit.
- **Repo**: `onemenny/eliyah-acoustic` (public), created and pushed 2026-08-13.

## Known open items (see Unified doc §7 for full detail)

1. **5 catalog product models' images/details are pending from the user.** Phase 1 scope requires 5 real speaker models; build the catalog against placeholder content first, swap in real assets once supplied. This blocks Phase 1 "Done", not the build itself.
2. **Canonical currency** (ILS vs USD) — recommended ILS as canonical, not yet confirmed.
3. **About-section team photo** — currently a placeholder product shot, not a real portrait.
4. **Wordmark vector logo** — currently set in type; a real vector lockup is needed from the client eventually (not a Phase 1 blocker).

## Phase roadmap (see Unified doc §2 for full detail)

1. **Phase 1 — Marketing homepage + 5-model catalog.** GitHub Pages (static export). No configurator, no checkout. **Next up.**
2. **Phase 2 — Configurator upgrade.** Live per-variant pricing for the 5 models, still quote-driven (no checkout). Migrate off GitHub Pages onto Vercel + custom domain. Legal pages (Terms/Privacy/Refund) land here.
3. **Phase 3 — E-commerce checkout.** Stripe + Tranzila, server-side price recomputation, webhook-confirmed orders, billing-country payment routing.
4. **Phase 4 — intentionally undefined.**

## Next step candidates

- Run `/seed-backlog "Phase 1"` to turn Phase 1 into GitHub issues on the board.
- Once the user supplies the 5 product models' images/copy, update the Unified doc's §7 open item 0 and proceed with catalog content.
- Run `/build-feature` (or a specific issue) once the backlog exists, to kick off the orchestrator → builder → reviewer pipeline.

## Maintenance note

Update this file whenever the pipeline advances an issue (spec'd/building/reviewing/done) or new issues are seeded. Keep entries to current-state facts and open risks/decisions — retry-cycle blow-by-blows and file-by-file build logs belong in commit messages and git history, not here. When a risk resolves, delete its entry rather than appending a "RESOLVED" note next to the original text.
