# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Ember.js (Octane, Embroider + Vite) site for The Butcher's Market. It has public pages (home, deli, meat, grab-and-go, cafe) and an `/admin` CMS for editing the content those pages show. The backend is a separate JSON:API service; in development and tests it is mocked with MirageJS.

Use pnpm (Node and pnpm versions are pinned in `package.json` via Volta).

## Commands

- `pnpm start`: Vite dev server.
- `pnpm build`: production build into `dist/`. Use `pnpm vite build --mode development` for a dev build.
- `pnpm test`: builds in development mode with `VITE_USE_MIRAGE=true`, then runs `ember test --path dist`.
- Run a subset of tests: `pnpm test --filter "<module or test name>"`. The args go to `ember test`.
- `pnpm lint`: runs every `lint:*` script (eslint, stylelint, ember-template-lint, prettier check, and `ember-tsc --noEmit` for Glint type-checking). `pnpm lint:fix` auto-fixes and formats.
- `pnpm lint:types`: type-check only.

CI (`.github/workflows`) runs `pnpm lint` and `pnpm test` on PRs. To deploy, push to `master` and trigger a deploy on Render.com.

Script and config names follow the ember-cli app blueprint. Don't rename them, even when a name looks outdated: `lint:hbs` stays `lint:hbs` even though it now lints `.gts` files.

## Environment / Mirage

Config comes from Vite env vars (`.env.development`, `.example.env`, plus `.local` overrides) and is read only through `app/utils/config.ts`. When `VITE_USE_MIRAGE=true`:

- `API_URL` and `UPLOADS_DIR` become empty.
- `app/routes/application.js` boots the Mirage server from `app/mirage/servers/default.js` (dev only, never in tests). It seeds from `app/mirage/scenarios/default`.

The Mirage route handlers (filters, reorder endpoints, auth token, file uploads) live in `servers/default.js`. When you add an API call, update Mirage to match.

## Architecture

- **Templates are `.gts`.** Route templates in `app/templates/**` are template-only components. They receive `@model` and `@controller` and are typed with `RouteTemplate<Model, Controller>` from `app/utils/route-template.ts`. Many routes and controllers are still `.js`. Glint v2 runs in strict mode (no loose mode).
- **Data:** Ember Data / WarpDrive 5.6 models in `app/models`. All adapters extend `adapters/base/authenticated-json-api.ts`, which adds the bearer token from the `session` service and sends the user to sign-in on a 401. Custom endpoints such as drag-and-drop reordering (`reorderSpecials`, `reorderMeatBundles`) are methods on the model's adapter. They push the response back into the store so records don't stay dirty.
- **Auth:** `routes/admin.js` reads a JWT from localStorage in `beforeModel`. It redirects to `sign-in` if the token is missing, expired, or expires today.
- **Feature flags:** `services/features.ts` loads `feature-flag` records in the application route's `model` hook. Check a flag with `features.isEnabled(name)`.
- **Admin CRUD pattern** (per resource under `admin/<resource>/`): routes `index`, `new`, `edit`. `new` calls `store.createRecord` and rolls back unsaved attributes in `willTransition`. Controllers handle `saved`/`cancelled` transitions. Templates render a `<Resource>Form` component from `components/admin/<resource>/`.
  - **Forms** use `FormState` (`app/utils/form-state.ts`, which replaced ember-changeset) with validation maps from `app/validations/<model>.ts` (validators in `app/utils/validators.ts`). Edits stay in the `FormState` until `save`, so cancelling leaves the model untouched. Bind fields with `this.form.values.x` and `this.form.setter "x"`. The `components/admin/admin-form*` components provide the form layout and controls.
  - **Delete is always a modal:** a `Delete<Thing>Form` component mounted in the resource's `index.gts` and driven by `openDeleteModal`/`closeDeleteModal` on the index controller. The `delete` routes in `app/router.ts` are dead config with no route or template files. Don't add a `delete` route for a new resource.
- **Shared UI:** `ui-*` components (button, textbox, icon, alert, and so on) in `app/components`. Icons come from FontAwesome (registered in `app/font-awesome.ts`).
- **Styling:** Tailwind 4 via `@tailwindcss/vite` (`app/app.css`). Tailwind 4 outputs base utilities in alphabetical order, so a bare `hidden` loses to `inline-block`/`inline-flex` on the same element. Use a variant such as `max-sm:hidden` instead.

## Conventions

- In new or converted `.gts` components, write event handlers as arrow-function class fields, not `@action` methods. Leave `@action` alone in existing components you only touch in passing.
- Document component arguments (fields in a signature's `Args`) with multi-line JSDoc blocks (`/**` / ` * text` / ` */`), not single-line `/** */`. Leave existing in-body `//` comments as they are.
- Templates use double quotes (Prettier with `prettier-plugin-ember-template-tag`).

## Testing

There are almost no tests: one component test, plus unit tests for `sort-by`, `form-state`, and `validators`. A green lint and build don't prove a page renders. To check a UI change:

1. Add a temporary acceptance test under `tests/acceptance/`. `setupApplicationTest` from `butchers-market/tests/helpers` already sets up Mirage.
2. Create the Mirage records the page needs and assert on the real DOM.
3. Delete the test unless it's meant to stay.

`app/router.ts` has `test-route` routes that exist only for component tests.
