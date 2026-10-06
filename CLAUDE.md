# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Ember.js (Octane, Embroider + Vite) site for The Butcher's Market. It has public pages (home, deli, meat, grab-and-go, cafe) and an `/admin` CMS for editing the content those pages show. The backend is a separate JSON:API service; in development and tests it is mocked with MirageJS.

Use pnpm (Node and pnpm versions are pinned in `package.json` via Volta).

## Commands

- `pnpm start`: Vite dev server.
- `pnpm build`: production build into `dist/`. Use `pnpm vite build --mode development` for a dev build.
- `pnpm test`: builds in development mode with `VITE_USE_MIRAGE=true`, then runs `testem ci` against `dist`.
- Run a subset of tests: `pnpm ember test --path dist --filter "<module or test name>"` after a `pnpm test` build (testem has no `--filter`). Rebuild first if you changed code.
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

- **Templates are `.gts`.** Route templates in `app/templates/**` are components that receive `@model` (and `@controller`). Each declares its own `interface Signature { Args: { model: ... } }`, typed as `TOC<Signature>` when template-only or as a class component when it needs state or handlers. Page state and handlers live in the route template, not a controller. Only add a controller for query params. Glint v2 runs in strict mode (no loose mode).
- **Data:** WarpDrive 5.8. `services/store.ts` builds the store with `useLegacyStore`. Type the store with its default export.
  - **Resources** have a schema in `app/schemas/<resource>.ts` (`withDefaults` from `@warp-drive/legacy/model/migration-support`, plus a `WithLegacy<...>` type) registered in `services/store.ts`, and no model or adapter. Read with `store.request(query(...))` / `findRecord(...)` and use `content.data`. Import `query` from `app/builders/query` (lint enforces it), not from `@warp-drive/utilities/json-api`: the wrapper registers the type so creating a record refreshes that type's cached lists. `findRecord` comes from `@warp-drive/utilities/json-api`. Filters are flat keys: `{ 'filter[isHidden]': false }`. Save and delete with `saveRecord`/`destroyRecord` from `app/utils/records.ts`; forms pass `saveRecord` to `FormState`. Date fields are `{ kind: 'field', type: 'date' }` (`schemas/transformations.ts`) and getters are derived fields (`schemas/derivations.ts`). Custom endpoints are request builders in `app/builders/` (e.g. `reorderSpecials`, `reorderMeatBundles`), and the store applies their JSON:API response.
  - **Requests through `store.request`** pass through `handlers/auth.ts` (bearer token from the `session` service, sign-in on a 401) and `handlers/json-api.ts` (sets the JSON:API `Content-Type` the API needs to parse bodies, and singularizes the API's plural types to match the schemas). They skip adapters and serializers.
  - **Leftover legacy pieces:** no resource uses `app/adapters`, `app/serializers`, `app/transforms`, or the legacy store methods (`findAll`/`query`/`save`) any more, but they're still in place, and `ENABLE_LEGACY_REQUEST_METHODS` is still on in `ember-cli-build.mjs`. Don't add new uses; they're due to be removed.
- **Auth:** `routes/admin.js` reads a JWT from localStorage in `beforeModel`. It redirects to `sign-in` if the token is missing, expired, or expires today.
- **Feature flags:** `services/features.ts` loads `feature-flag` records in the application route's `model` hook. Check a flag with `features.isEnabled(name)`.
- **Admin CRUD pattern** (per resource under `admin/<resource>/`): routes `index`, `new`, `edit`. `new` calls `store.createRecord` and rolls back unsaved attributes in `willTransition`. The `new`/`edit` route templates handle `saved`/`cancelled` by transitioning back to the index. Templates render a `<Resource>Form` component from `components/admin/<resource>/`.
  - **Forms** use `FormState` (`app/utils/form-state.ts`, which replaced ember-changeset) with validation maps from `app/validations/<model>.ts` (validators in `app/utils/validators.ts`). Edits stay in the `FormState` until `save`, so cancelling leaves the model untouched. Bind fields with `this.form.values.x` and `this.form.setter "x"`. The `components/admin/admin-form*` components provide the form layout and controls.
  - **Delete is always a modal:** a `Delete<Thing>Form` component mounted in the resource's `index.gts` and driven by `openDeleteModal`/`closeDeleteModal` on that index template's class. The `delete` routes in `app/router.ts` are dead config with no route or template files. Don't add a `delete` route for a new resource.
- **Shared UI:** `ui-*` components (button, textbox, icon, alert, and so on) in `app/components`. Icons come from FontAwesome (registered in `app/font-awesome.ts`).
- **Styling:** Tailwind 4 via `@tailwindcss/vite` (`app/app.css`). Tailwind 4 outputs base utilities in alphabetical order, so a bare `hidden` loses to `inline-block`/`inline-flex` on the same element. Use a variant such as `max-sm:hidden` instead.

## Conventions

- In new or converted `.gts` components, write event handlers as arrow-function class fields, not `@action` methods. Leave `@action` alone in existing components you only touch in passing.
- Document component arguments (fields in a signature's `Args`) with multi-line JSDoc blocks (`/**` / ` * text` / ` */`), not single-line `/** */`. Leave existing in-body `//` comments as they are.
- Templates use double quotes (Prettier with `prettier-plugin-ember-template-tag`).
- Commit messages are one short imperative line with no body (e.g. `Switch to WarpDrive in legacy mode`). Explanations go in the PR description.
- Don't add AI attribution to commits or PRs: no "Generated with Claude Code" line in PR descriptions and no `Co-Authored-By` trailer in commit messages.

## Testing

Acceptance tests in `tests/acceptance/` are smoke tests that check the app is wired up end to end, against Mirage:

- `public-pages-test.ts`: each public page loads and shows its data (seeded from the default Mirage scenario).
- `admin-pages-test.ts`: every admin index, new, and edit page renders, and the admin requires signing in.
- `admin/<resource>-test.ts`: the admin workflows for one resource (create, edit, cancel, delete, reorder, and the requests sent to the API). There's one for each migrated resource; add one per resource as it moves to WarpDrive schemas, written against the old code first. Create tests start from the list page, so they catch a list that doesn't show the new record. `tests/helpers/table.ts` finds rows, columns, and buttons by text.

Other tests: one component test, plus unit tests for `sort-by`, `form-state`, and `validators`. A green lint and build don't prove a page works, so add or extend an acceptance test for UI and data changes. `setupApplicationTest` from `butchers-market/tests/helpers` sets up Mirage, and `setupAuthentication` from `tests/helpers/authenticate` signs in. To check what was sent to the API, use `trackRequests` from `tests/helpers/track-requests` (Mirage doesn't keep requests itself).

`app/router.ts` has `test-route` routes that exist only for component tests.
