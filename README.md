# MealPlan UI

React + TypeScript + Vite front end for the MealPlan and Ingredients APIs.
See [docs/ui-stack-decisions.md](docs/ui-stack-decisions.md) for why each tool was chosen.

## Getting started

```bash
npm install
npm run dev
```

Start the APIs first (from their own repos):

| API         | URL                   | OpenAPI document   |
| ----------- | --------------------- | ------------------ |
| MealPlan    | http://localhost:5290 | `/openapi/v1.json` |
| Ingredients | http://localhost:5280 | `/openapi/v1.json` |

Neither API enables CORS, so in development the Vite dev server proxies
`/api/mealplan/*` and `/api/ingredients/*` to them (see `vite.config.ts`).
UI code should call `mealPlanApi` / `ingredientsApi` from `src/api/clients.ts`
and never hard-code API URLs. For deployed environments, set the
`VITE_*_API_URL` variables in `.env.example` (the APIs must then allow CORS).

## Scripts

| Script                    | Purpose                            |
| ------------------------- | ---------------------------------- |
| `dev`                     | Start the dev server               |
| `build`                   | Typecheck and build for production |
| `lint`                    | ESLint                             |
| `format` / `format:check` | Prettier write / verify            |
| `typecheck`               | `tsc -b`                           |
| `test`                    | Vitest                             |

A PR should pass `format:check`, `lint`, `typecheck`, `test` and `build`.

## Layout

```
src/
  api/          fetch client + one client per API (generated types go in api/generated/)
  components/   shared components (Layout)
  lib/          app-wide setup (TanStack Query client)
  pages/        one component per route
  test/         test setup
```

## Conventions

- Arrow functions everywhere (`const Foo = () => {}`), including components and top-level functions. Enforced by the ESLint `func-style` rule; no function declarations.
- Server state goes through TanStack Query. Plain `useState` for UI state.
