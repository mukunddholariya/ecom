
<!-- BEGIN:nextjs-agent-rules -->

**# This is NOT the Next.js you know**

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Development Instructions

## 1. Before Writing Code

- Inspect the existing project structure, package.json, and configuration.
- Follow the installed Next.js version and read its relevant documentation in `node_modules/next/dist/docs/` before using unfamiliar APIs.
- Check existing components, utilities, aliases, styles, and dependencies before creating new ones.
- Preserve existing functionality and avoid unrelated changes.

## 2. Technology Stack

- Next.js with App Router, React, and TypeScript.
- shadcn/ui with the configured Radix UI base.
- Tailwind CSS using the project's existing configuration.
- pnpm as the package manager.
- Preserve the existing shadcn preset, theme, CSS variables, and RTL setup.

Do not assume a library, configuration, or API exists without verifying it.

## 3. Component Architecture

- Follow Atomic Design principles where appropriate:
  - Atoms: Button, Input, Label, Badge.
  - Molecules: FormField, SearchInput, PasswordInput.
  - Organisms: LoginForm, DataTable, Sidebar.
  - Templates: Reusable page layouts.
  - Pages: Route-specific composition.
- Keep feature-specific components close to their feature.
- Prefer simple, reusable components over duplicated implementations.
- Avoid unnecessary abstraction and excessive folder nesting.
- Follow the existing project structure rather than reorganizing everything.

## 4. shadcn/ui and Radix UI

- Reuse existing components from `components/ui` and other shared locations.
- Inspect existing component APIs before creating replacements.
- Compose existing components before implementing custom UI from scratch.
- Maintain keyboard accessibility, focus management, and semantic HTML.
- Use existing variants and styling conventions.
- Do not introduce another UI library without a clear reason.
- Do not overwrite customized components when adding shadcn components.

## 5. Styling and Design System

- Use existing Tailwind utilities, CSS variables, and semantic design tokens.
- Avoid hardcoded colors when project tokens are available.
- Preserve light mode, dark mode, and the current theme configuration.
- Keep spacing, typography, borders, radii, and shadows consistent.
- Avoid duplicating long styling patterns across components.
- Follow the installed Tailwind CSS version and its conventions.

## 6. RTL and Responsive Design

- Preserve the existing RTL configuration and direction handling.
- Prefer direction-aware logical properties over unnecessary left/right assumptions.
- Verify forms, icons, dropdowns, dialogs, navigation, and tables in RTL layouts.
- Ensure components also work correctly in LTR when required.
- Use mobile-first responsive layouts.
- Prevent horizontal overflow and clipped controls.

## 7. Next.js and React

- Follow the installed Next.js version's documented conventions.
- Prefer Server Components by default.
- Add `"use client"` only when client-side interactivity or browser APIs require it.
- Keep client components as small as reasonably possible.
- Follow the project's existing data-fetching and caching patterns.
- Keep secrets and private environment variables server-side.
- Use appropriate loading, error, and not-found UI.
- Avoid unnecessary effects, rerenders, and client-side data fetching.

## 8. TypeScript and Code Quality

- Use strict typing and avoid unnecessary `any`.
- Reuse existing types and interfaces where appropriate.
- Handle null, undefined, loading, empty, and error states explicitly.
- Keep components focused on clear responsibilities.
- Extract shared logic when it provides meaningful reuse.
- Follow existing naming conventions and import aliases.
- Avoid unsafe type assertions unless justified.

## 9. Forms and Validation

- Reuse existing form patterns and components.
- Use React Hook Form and Zod when installed and appropriate.
- Provide accessible labels and useful validation feedback.
- Handle submitting, success, failure, and disabled states.
- Prevent accidental duplicate submissions.
- Never expose sensitive information in errors or logs.

## 10. Dependencies and Package Management

- Use pnpm for package management and project scripts.
- Inspect existing dependencies before installing anything.
- Prefer existing utilities and libraries where appropriate.
- Do not change package versions or package managers unnecessarily.
- Avoid adding dependencies for trivial functionality.

## 11. Implementation Workflow

For each task:

1. Understand the requested behavior.
2. Inspect relevant files and existing patterns.
3. Check the applicable Next.js documentation.
4. Identify the smallest complete implementation.
5. Reuse existing UI components, types, utilities, and design tokens.
6. Implement the changes without breaking unrelated functionality.
7. Run applicable lint, type-check, and test commands when available.
8. Report modified files and any checks that could not be completed.

Never claim a check passed unless it was actually run.

## 12. Skill Usage

- For frontend development tasks, consult `.agents/skills/nextjs-frontend/SKILL.md` when relevant.
- Treat the skill as detailed implementation guidance and this file as the project's baseline rules.
- Follow the existing codebase and installed dependencies if examples in a skill do not match the actual project.


## 13. React Import Conventions

- Always use named imports for React hooks and APIs.
- Never use namespace imports such as `import * as React from "react"`.
- Do not access hooks through the React namespace, such as `React.useEffect()` or `React.useState()`.
- Import only the hooks or APIs required by the file.
- Follow the project's ESLint rules for React imports.

Preferred:

```tsx
import { useEffect, useState } from "react";

export function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Effect logic
  }, []);

  return <button onClick={() => setCount((value) => value + 1)}>
    Count: {count}
  </button>;
}
```

Avoid:

```tsx
import * as React from "react";

React.useEffect(() => {}, []);
```

Also avoid importing unused hooks or React APIs.
