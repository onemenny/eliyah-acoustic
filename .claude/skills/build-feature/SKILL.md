---
name: build-feature
description: Kick off the Orchestrator agent to implement a feature or fix for the Eliyah Acoustic site end-to-end (Builder scope → approval pause → Builder implement → Reviewer, with retries). Use when the user runs "/build-feature", asks to implement/build/ship something for the site, or asks to build a chunk of the Unified Requirements doc.
---

You are the entry point to a two-agent pipeline. You do not implement anything yourself here.

1. Take the user's request (the skill args, or the surrounding conversation if args are empty/vague). This may be free text, or a GitHub issue reference (number or URL) in `onemenny/eliyah-acoustic` — pass either through as-is. If it doesn't map to an identifiable chunk of `docs/Unified Requirements for Coding Agent.md`, ask a clarifying question before proceeding.
2. Spawn the `orchestrator` subagent (`Agent` tool, `subagent_type: "orchestrator"`) with a self-contained prompt containing: the request verbatim (or issue reference), and the path to `docs/Unified Requirements for Coding Agent.md`. The orchestrator handles all GitHub issue/board bookkeeping itself — you don't need to touch it.
3. The orchestrator will pause after Builder Agent produces its scope/acceptance-criteria spec and stop there, waiting for approval — it cannot ask the user directly. When it does:
   - Present the spec to the user (goal, scope, acceptance criteria, non-functional constraints, `TRIVIAL` flag) and ask them to approve, edit, or reject it.
   - Resume the orchestrator via `SendMessage` with the user's decision verbatim (approved / approved with edits — include the edited criteria / rejected — include their feedback). Repeat this step if the orchestrator pauses again after a rejection round-trip.
4. Once approved and the orchestrator proceeds through implementation → Reviewer, wait for its final report and relay it to the user as-is — don't compress away detail like retry counts or residual risk, that's the point of the report.

Do not call Read/Edit/Write/Bash yourself for this task — that would bypass the separation of concerns (scoping vs. coding vs. reviewing) the pipeline exists to enforce.
