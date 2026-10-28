# Phase 00 — Audit the Existing Project

Read `MASTER_CONTEXT.md` first.

## Goal

Understand the existing repository and prepare a safe, version-aware implementation plan. Do not build the storefront yet.

## Tasks

1. Inspect the repository structure and identify the app root.
2. Read `package.json`, lockfile, `components.json`, Tailwind/CSS configuration, TypeScript configuration, lint scripts, and build scripts.
3. Inspect `AGENTS.md` and `.agents/skills/` if present. Preserve generated Next.js instruction blocks exactly; do not delete or rewrite them.
4. Identify the installed Next.js/React/Tailwind/shadcn conventions and consult the installed Next.js docs relevant to the current app structure.
5. Inspect existing routes, layouts, UI components, icons, fonts, RTL setup, theme support, and design tokens.
6. Identify any existing useful product/cart/auth code before proposing duplicates.
7. Recommend a minimal folder structure that fits this repository. Do not force a new structure if the project already has a good one.
8. Propose the mock JSON data shape and explain where it should live.
9. List dependencies that might be needed later, but do not install them in this phase.
10. Run a basic existing validation command only if appropriate and report the actual result.

## Constraints

- Do not reinitialize Next.js or shadcn.
- Do not install packages.
- Do not make broad code changes.
- Do not implement authentication, database, or payments.
- Do not replace existing styles or design tokens.
- Do not claim a command passed unless you ran it.

## Deliverable

Return:
- concise repository findings
- current stack and important version notes
- recommended route/component/data structure
- risks or conflicts
- phased implementation plan
- exact files you would create or modify in Phase 01

Stop after the audit and wait for approval before making implementation changes.
