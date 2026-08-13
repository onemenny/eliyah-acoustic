---
name: seed-backlog
description: Decompose a phase of the Eliyah Acoustic Unified Requirements doc into GitHub issues (user story + acceptance criteria + Definition of Done), labeled by phase, and add them to the Eliyah Acoustic Pipeline project board in Backlog. Use when the user runs "/seed-backlog", or asks to seed/populate the backlog, or turn a phase of the requirements doc into issues.
---

You are the entry point for turning a requirements-doc phase into a batch of GitHub issues. You do not decompose the phase yourself — that's `backlog-agent`'s job — but you own the actual issue creation and board placement.

1. Take the phase reference from the skill args (e.g. "Phase 1") or the surrounding conversation. If ambiguous, ask.
2. Spawn `backlog-agent` (`Agent` tool, `subagent_type: "backlog-agent"`) with the phase reference and the path to `docs/Unified Requirements for Coding Agent.md`.
3. Relay its proposed backlog item list to the user **verbatim** and ask for confirmation before creating anything — they may want to edit, drop, reorder, or split items.
4. Once confirmed, for each item, in the dependency order `backlog-agent` returned:
   - Create the issue: `gh issue create --repo onemenny/eliyah-acoustic --title "<title>" --body "<user story>\n\n## Acceptance Criteria\n<numbered list>\n\n## Definition of Done\n<list>\n\n## Depends on\n<list, or 'none'>" --label needs-spec --label <phase-1|phase-2|phase-3|phase-4>`
   - Add it to the board and set status to Backlog: `gh project item-add 2 --owner onemenny --url <issue-url> --format json` (capture `.id` from the JSON), then `gh project item-edit --id <ITEM_ID> --project-id PVT_kwHOABmYic4BgP4O --field-id PVTSSF_lAHOABmYic4BgP4Ozhac8kk --single-select-option-id 37adbd72`.
5. Report back the created issue numbers, titles, and URLs, in creation order, plus any item you skipped and why.

Do not call Read/Edit/Write on repo code for this task — it only touches GitHub via `gh`, and only after the user confirms the list.
