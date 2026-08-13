#!/usr/bin/env bash
# PreToolUse hook (all tools): auto-allows a tool call only when every
# absolute path it references stays inside one of the ALLOWED_PATTERNS
# roots below. For Bash this scans every absolute-path token in the
# command (and never auto-allows sudo or a cd/-C escape via "..", "~", or
# "-"); for path-taking tools (Read/Write/Edit/NotebookEdit/Glob/Grep/...)
# it checks the tool's own path field(s) directly. Anything else falls
# through to the normal permission prompt (this script just exits 0 with
# no output).
PROJECT_ROOT="/Users/menny/dev/EliyaAcustics"

# noglob must be on BEFORE the array below is built, or the "*" segments get
# filename-expanded against the current filesystem right here instead of
# staying literal patterns for the case-statement matching further down.
set -f

# Case-statement glob patterns (left unquoted where used, so "*" expands).
# /tmp and /private/tmp (macOS symlinks /tmp -> /private/tmp, but both forms
# show up literally in commands) cover session scratchpads plus the ad-hoc
# /tmp/* paths agents commonly use for mutation-testing scratch work.
ALLOWED_PATTERNS=(
  "$PROJECT_ROOT"
  "$PROJECT_ROOT"/*
  "/tmp"
  "/tmp"/*
  "/private/tmp"
  "/private/tmp"/*
)

# Returns 0 (allowed) for a relative path (resolves under cwd, which is
# already the project root) or an absolute path matching ALLOWED_PATTERNS;
# returns 1 otherwise.
path_allowed() {
  local tok="$1"
  case "$tok" in
    /*)
      for pattern in "${ALLOWED_PATTERNS[@]}"; do
        case "$tok" in
          $pattern) return 0 ;;
        esac
      done
      return 1
      ;;
    *)
      return 0
      ;;
  esac
}

input=$(cat)
tool_name=$(printf '%s' "$input" | jq -r '.tool_name // empty')

case "$tool_name" in
  Bash)
    cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty')
    [ -z "$cmd" ] && exit 0

    # Never auto-allow privilege escalation.
    echo "$cmd" | grep -qE '(^|[|&;]\s*)sudo\b' && exit 0

    # Never auto-allow cd/-C escapes via .., ~, or -.
    echo "$cmd" | grep -qE '\b(cd|-C)\s+(\.\.|~|-)($|[[:space:]/])' && exit 0

    # Every absolute path token (word-split, not substring-matched, so
    # relative paths like app/page.tsx are never mistaken for absolute
    # ones) must match one of ALLOWED_PATTERNS. A quoted path containing
    # spaces (e.g. a filename with spaces) gets word-split too, so its
    # leading token carries the opening quote character ("/foo vs /foo) -
    # strip it before the /* check, or the token silently fails to look
    # like an absolute path and skips the check entirely (fail open).
    for tok in $cmd; do
      stripped="${tok#[\"\']}"
      case "$stripped" in
        /*) path_allowed "$stripped" || exit 0 ;;
      esac
    done
    ;;
  Read|Write|Edit)
    fp=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')
    [ -z "$fp" ] && exit 0
    path_allowed "$fp" || exit 0
    ;;
  NotebookEdit)
    fp=$(printf '%s' "$input" | jq -r '.tool_input.notebook_path // empty')
    [ -z "$fp" ] && exit 0
    path_allowed "$fp" || exit 0
    ;;
  Glob|Grep)
    # No explicit path means "search cwd" (the project root) - allowed.
    p=$(printf '%s' "$input" | jq -r '.tool_input.path // empty')
    [ -n "$p" ] && { path_allowed "$p" || exit 0; }
    ;;
  *)
    # Unrecognized tool: no generic path field to check, so don't guess -
    # fall through to the normal permission prompt.
    exit 0
    ;;
esac

echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow","permissionDecisionReason":"Operation is scoped to an allowed directory"}}'
