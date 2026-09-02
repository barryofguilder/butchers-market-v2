# The Butcher's Market

Source code for The Butcher's Market website ([http://thebutchersmarket.com](http://thebutchersmarket.com)).

## Prerequisites

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with npm)
- [Ember CLI](https://cli.emberjs.com/release/)
- [Google Chrome](https://google.com/chrome/)

## Installation

- `git clone <repository-url>` this repository
- `cd butchers-market`
- `npm install`

## Running / Development

- `npm run start`
- Visit your app at [http://localhost:4200](http://localhost:4200).
- Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

- `npm run test`
- `npm run test:ember -- --server`

### Linting

- `npm run lint`
- `npm run lint:fix`

### Building

- `pnpm vite build --mode development` (development)
- `pnpm build` (production)

### Deploying

- Push changes to `master` and then trigger a deploy on [Render.com](https://render.com).
- Render's configuration lives in `render.yaml`. The `butchers-market-ui` service was
  originally configured by hand in the dashboard, so syncing the Blueprint the first time will
  overwrite those settings — confirm the file matches the dashboard before doing so.

### Prerendering

The public routes (`/`, `/deli`, `/grab-and-go`, `/meat`) are prerendered to static HTML so that
crawlers and link previews get real content instead of an empty SPA shell. `pnpm build` runs
`vite build` and then `scripts/prerender.mjs`, which drives the built app in headless Chrome and
snapshots each route to `dist/<route>/index.html`, along with a `sitemap.xml`.

FastBoot is not used, and can't be — it does not support the Embroider + Vite build pipeline and
is slated for deprecation in favour of Vite SSR.

- Admin routes are excluded on purpose; they are auth-gated CRUD pages with nothing to index.
- A prerendered page loads static markup in `#prerender`, then boots the app into `#app-root` and
  swaps once the first route has rendered (`app/instance-initializers/prerender.js`). Visitors
  always end up on live data.
- The snapshots themselves go stale between deploys, so `.github/workflows/rebuild.yaml` triggers
  a daily Render rebuild. It can also be run on demand from the Actions tab.
- To prerender locally: `pnpm build`, then serve `dist/`.

## Further Reading / Useful Links

- [ember.js](https://emberjs.com/)
- [Vite](https://vite.dev)
- Development Browser Extensions
  - [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  - [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
