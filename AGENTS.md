# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

# Project-specific: hackathon-may-2026

## Stack
- **SvelteKit** (Svelte 5 runes mode) + **TypeScript** + **Tailwind CSS v4**
- **shadcn-svelte** (v1.2.7, style: nova) for UI components
- **ESLint** configured with typescript-eslint + eslint-plugin-svelte

## Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run check` — svelte-check

## Structure
- `frontend/` — single SvelteKit app (no monorepo)
- `frontend/src/routes/layout.css` — global styles + shadcn CSS variables
- `frontend/src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `frontend/src/lib/components/ui/` — shadcn components

## shadcn-svelte notes
- **CLI init is broken non-interactively** (needs TTY for preset prompt). Add components via `npx shadcn-svelte add <component> --yes`
- `components.json` style must be one of: `nova`, `vega`, `maia`, `lyra`, `mira`, `luma`
- Generated components live in `src/lib/components/ui/<name>/` — do NOT manually edit unless fixing legacy patterns (CLI updates will overwrite)
- After adding a component, audit for these legacy patterns and fix in the generated file:
  - `bind:this` → `{@attach ...}` (preferred in Svelte 5)
  - `href` without `resolve()` → needs `resolveRouting()` for SvelteKit CS navigation (SE-1343)
  - `on:click` → `onclick`
  - `class:` → `class={...}`
  - `<slot>` → `{#snippet}` + `{@render}`
  - `$:` → `$derived` / `$effect`

## Svelte 5 conventions (must follow)
- `$props()` — NEVER `export let`
- `{@render children()}` — NEVER `<slot>`
- `onclick={...}` — NEVER `on:click={...}`
- `$state()` for reactivity, plain `let` otherwise
- `$derived()` for computed values, NEVER `$:`
- `$effect` only as escape hatch (prefer event handlers)
- `{#each items key={item.id}}` — always keyed
- `{#snippet name()}` + `{@render name()}` for reusable markup
