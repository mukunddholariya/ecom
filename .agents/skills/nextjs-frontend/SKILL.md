
---
name: nextjs-frontend
description: Builds and maintains production-quality Next.js applications using the App Router, TypeScript, shadcn/ui with Radix UI, Tailwind CSS, accessible reusable components, Atomic Design principles, and RTL support. Use when creating pages, components, forms, layouts, navigation, or refactoring frontend code.
---

# Next.js Frontend Development Skill

## 1. Project Inspection

Before making changes:

- Inspect the existing project structure and package.json.
- Read the existing components, layouts, styles, and configuration.
- Inspect components.json and the current shadcn/ui setup.
- Check the installed versions of Next.js, React, TypeScript,
  Tailwind CSS, and relevant UI libraries.
- Identify existing design tokens, aliases, utilities, and conventions.
- Never assume a configuration or dependency exists without checking.

## 2. Technology Stack

Follow the project's existing setup:

- Next.js with App Router.
- React and TypeScript.
- shadcn/ui using the Radix UI base.
- Tailwind CSS using the project's installed version.
- Existing CSS variables and theme configuration.
- React Hook Form and Zod when already installed and appropriate.
- pnpm for package management.

Do not migrate libraries, upgrade packages, or change the
project configuration without a clear requirement.

## 3. Next.js Architecture

- Use the App Router conventions already established in the project.
- Prefer React Server Components by default.
- Add "use client" only when browser APIs, state, effects, or
  client-side event handlers are necessary.
- Keep client components as small as reasonably possible.
- Fetch server-side data in appropriate server components or
  server-side data-access modules.
- Keep secrets and private environment variables on the server.
- Use route handlers for appropriate HTTP API endpoints.
- Use loading.tsx, error.tsx, not-found.tsx, and layout.tsx
  where they improve the user experience.
- Follow the installed Next.js version's APIs and conventions.
- Avoid unnecessary useEffect-based data fetching.
- Use semantic HTML and accessible navigation.

## 4. Component Architecture

Use Atomic Design principles where they improve maintainability:

- Atoms: Input, Button, Label, Badge, Checkbox, Icon.
- Molecules: SearchField, FormField, PasswordInput.
- Organisms: LoginForm, DataTable, Sidebar, Header.
- Templates: Reusable page layouts and structural compositions.
- Pages: Route-specific composition and data integration.

Treat this as a logical organization strategy, not a reason
to create unnecessary folders or wrapper components.

Suggested structure, adapted to the existing repository:

src/
  app/
  components/
    ui/
    atoms/
    molecules/
    organisms/
    layouts/
  features/
  hooks/
  lib/
  types/

Do not reorganize the entire repository just to match this example.

Keep feature-specific components close to their feature when
that improves cohesion. Keep shared components generic and reusable.

## 5. shadcn/ui and Radix UI

- Reuse existing components from components/ui.
- Before creating a new component, check whether an equivalent
  component already exists.
- Prefer composing existing shadcn/ui components over
  rebuilding their functionality.
- Use Radix primitives for accessible behavior when appropriate.
- Follow the existing components.json configuration and aliases.
- Preserve keyboard navigation, focus behavior, and accessibility.
- Customize component appearance through supported variants,
  className composition, and project design tokens.
- Do not edit generated or copied UI components unnecessarily.
- Add new shadcn components using the project's package manager
  and the existing configured registry.
- Never introduce a second component library for functionality
  already covered by the current stack without justification.

## 6. Tailwind CSS and Design System

- Reuse existing theme variables, CSS variables, and utility classes.
- Use semantic design tokens for backgrounds, foregrounds,
  borders, muted text, primary colors, and destructive states.
- Avoid hardcoded colors when an appropriate design token exists.
- Avoid duplicating long utility-class combinations across components.
- Extract shared patterns when doing so improves readability.
- Use the existing dark-mode strategy.
- Keep typography, spacing, radii, shadows, and component sizing
  visually consistent.
- Follow the installed Tailwind version's syntax and conventions.
- Do not introduce a new styling framework or configuration system.

## 7. RTL and Responsive Design

RTL support is a first-class project requirement.

- Preserve the existing RTL configuration and direction handling.
- Use logical CSS properties such as ms-*, me-*, ps-*, pe-*,
  and start/end positioning when supported by the installed setup.
- Prefer direction-aware layouts instead of unnecessary left/right
  assumptions.
- Verify icons, dropdowns, dialogs, forms, navigation, and tables
  in both LTR and RTL contexts when relevant.
- Do not change global direction behavior without understanding
  the application's requirements.
- Build mobile-first responsive layouts.
- Check small mobile, tablet, laptop, and desktop widths.
- Prevent horizontal overflow and clipped interactive controls.

## 8. TypeScript Standards

- Keep strict typing and avoid unnecessary any.
- Define reusable interfaces or types for shared data structures.
- Use discriminated unions when they improve type safety.
- Type component props explicitly when useful.
- Avoid duplicating types that already exist in the project.
- Avoid unsafe type assertions and non-null assertions unless justified.
- Handle null, undefined, and empty states deliberately.
- Use the correct types for server and client boundaries.

## 9. Forms and Validation

When building forms:

- Reuse existing form components and patterns.
- Use React Hook Form and Zod if available and suitable.
- Keep validation rules consistent with the application's requirements.
- Provide accessible labels and useful validation feedback.
- Display loading, success, error, and disabled states.
- Prevent accidental duplicate submissions.
- Keep field components reusable without overengineering them.
- Never expose sensitive values in logs or user-facing errors.

## 10. State and Data Handling

- Keep state as close as possible to the components that need it.
- Prefer URL search parameters for shareable filters and pagination.
- Use server state tools only when already configured or justified.
- Avoid adding global state libraries for simple local state.
- Handle loading, empty, error, and success states.
- Avoid unnecessary rerenders and premature memoization.
- Validate untrusted input at appropriate boundaries.
- Keep business logic out of presentation-only components.

## 11. Accessibility and User Experience

- Use semantic HTML elements.
- Provide accessible names for icon-only buttons.
- Ensure keyboard accessibility and visible focus states.
- Use dialogs, menus, tooltips, and popovers appropriately.
- Avoid clickable divs when a button or link is suitable.
- Respect reduced-motion preferences where relevant.
- Make interactive states visually clear.
- Keep layouts polished, consistent, and responsive.

## 12. Dependencies and Package Management

- Use pnpm for dependency installation and scripts.
- Inspect package.json before adding a dependency.
- Prefer existing project utilities over new dependencies.
- Do not install a library for functionality that can be implemented
  cleanly with the existing stack.
- Never replace the lockfile or switch package managers unnecessarily.
- Do not upgrade unrelated dependencies during feature work.

## 13. Code Modification Rules

- Make the smallest complete change that satisfies the requirement.
- Preserve existing behavior unless a change is requested.
- Follow current naming conventions and import aliases.
- Avoid duplicated logic, oversized components, and unnecessary abstractions.
- Keep components focused on one clear responsibility.
- Do not silently remove features or modify unrelated files.
- Explain important architectural decisions briefly.
- Never claim that code or tests passed unless they were actually run.

## 14. Verification Checklist

Before completing a task:

1. Check TypeScript errors.
2. Run the relevant lint command if configured.
3. Run relevant tests if available.
4. Verify imports and component usage.
5. Verify responsive behavior and RTL behavior when applicable.
6. Check loading, error, empty, and disabled states.
7. Confirm that existing design tokens and components are reused.
8. Summarize modified files and any remaining issues.

## 15. Decision-Making Rules

When multiple implementations are possible, prefer:

1. Existing project conventions.
2. Existing shadcn/ui and Radix components.
3. Simple, type-safe and accessible solutions.
4. Reusable abstractions with demonstrated value.
5. Minimal dependencies and minimal unrelated changes.

If an architectural requirement is unclear, inspect the codebase
first and ask a focused question when necessary.


## React Import Standards

- Use named imports from `react` for hooks and other required exports.
- Never use `import * as React from "react"`.
- Use `useEffect()`, `useState()`, `useMemo()`, and other hooks directly after importing them by name.
- Do not use `React.useEffect()`, `React.useState()`, or other namespace-based React API calls.
- Keep imports minimal and remove unused imports.
- Ensure generated and modified code passes the project's ESLint rules.
