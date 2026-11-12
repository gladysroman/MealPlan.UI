# MealPlan UI — Stack Decisions

Status: **Draft** · Decided up front so tooling doesn't have to change mid-project.

## Summary

| Concern              | Decision                                            | Alternatives considered           |
| -------------------- | --------------------------------------------------- | --------------------------------- |
| Language             | TypeScript (`strict: true`)                         | Plain JavaScript                  |
| Framework            | React                                               | —                                 |
| Bundler / dev server | Vite                                                | Webpack (+ Babel)                 |
| Linting              | ESLint (flat config) + `typescript-eslint`          | Biome, oxlint                     |
| Formatting           | Prettier                                            | Biome                             |
| Server state         | TanStack Query                                      | Redux Toolkit Query, SWR          |
| Client UI state      | React state first; Zustand only if needed           | Redux Toolkit, Jotai              |
| Routing              | React Router                                        | TanStack Router                   |
| Styling              | Tailwind CSS                                        | Plain CSS, MUI, shadcn/ui         |
| Testing              | Vitest + React Testing Library                      | Jest                              |
| API types            | Generated from the API's OpenAPI spec               | Hand-written types                |
| Repo layout          | Separate repo (`MealPlan.UI`), independent pipeline | `web/` folder inside the API repo |

## Rationale

### TypeScript

Brings C#-style static types and rules to JavaScript. Types for API requests and responses are generated from the backend's OpenAPI document, so the UI and API can't silently drift apart.

### React

Most widely used framework. React is about **state**: declare state, and React re-renders when actions change it. JSX looks like HTML but compiles to plain JavaScript.

### Vite (not Webpack)

Vite is the current default for new React projects. It uses native ES modules in development (near-instant startup) and Rollup for production builds, with far less configuration than Webpack. Babel is handled internally, so we don't configure it. Chosen now because switching bundlers later is a large change.

### ESLint + Prettier

- **ESLint** enforces code standards and catches bugs, including React hooks rules and TypeScript-aware rules. Largest rule ecosystem and the industry standard.
- **Prettier** handles formatting only, so formatting is never a code-review topic.
- Standards enforced by lint rules:
  - Pick **one** function style (`func-style`): function declarations _or_ arrow functions, not both. Decision (updated 2026-10-15): arrow functions everywhere, including components and top-level functions, enforced with `func-style: expression` and `prefer-arrow-callback`.
  - No unused variables, no `any` without justification.
- Biome (lint + format in one tool) was the credible alternative. Rejected for now: smaller plugin ecosystem and less learning material.

### State management

Two separate problems, two tools:

1. **Server state** (meals, side dishes from the API) → **TanStack Query**: caching, loading/error states, refetching, and cache updates after mutations. Covers most of this app's state needs.
2. **Client UI state** (modals, filters) → plain `useState` / `useReducer`. Add **Zustand** only if prop-passing becomes painful. Redux Toolkit is more machinery than this app needs.

### Styling

Tailwind CSS: utility classes, no separate stylesheet to manage, and works well with component-based code.

### Testing

Vitest shares Vite's config, so there is no second toolchain. React Testing Library for component tests.

## Developer workflow

- **Format on save** in VS Code (Prettier as default formatter), committed in `.vscode/settings.json`.
- **Scripts** in `package.json`: `dev`, `build`, `lint`, `format`, `format:check`, `typecheck`, `test`.
- **Pipeline gates** (a PR cannot merge if any fail): `format:check`, `lint`, `typecheck`, `test`, `build`.
- **Backend parity**: add an `.editorconfig` and run `dotnet format --verify-no-changes` (or CSharpier) as a pipeline step so the API is held to the same standard.

## Foundations to learn before starting

TypeScript, ESLint, Prettier, React, JavaScript fundamentals. Package manager: npm.

## Out of scope / revisit later

- Server-side rendering / Next.js (not needed for an authenticated app).
- Component kit (MUI, shadcn/ui) — revisit if Tailwind alone becomes tedious.
- Zustand / global client state — only when a concrete need appears.
