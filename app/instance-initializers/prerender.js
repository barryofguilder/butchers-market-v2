/**
 * Hands control from the prerendered snapshot over to the live app.
 *
 * A prerendered page (see scripts/prerender.mjs) ships static markup inside `#prerender` and
 * an empty `#app-root`, with `has-prerender` on <html> keeping `#app-root` hidden. Ember has
 * no rehydration story outside of FastBoot, so instead of trying to reuse that DOM we let the
 * app boot and fetch normally behind the snapshot, then swap once the first route has actually
 * rendered. The visitor sees static content immediately and live content a moment later, with
 * no blank frame in between.
 *
 * On a non-prerendered page (`/admin`, `/sign-in`, local dev) there is nothing to remove and
 * this is a no-op beyond flipping the readiness flag the prerenderer waits on.
 */

// `routeDidChange` fires in the router queue, which runs before Ember flushes its render
// queue, so we wait for #app-root to actually have content before swapping. Bounded so a
// route that somehow renders nothing still reveals the app rather than hanging on the snapshot.
const MAX_FRAMES = 60;

export function initialize(appInstance) {
  const config = appInstance.resolveRegistration('config:environment');

  if (config.environment === 'test') {
    return;
  }

  const router = appInstance.lookup('service:router');

  function reveal(framesWaited) {
    const appRoot = document.getElementById('app-root');

    if (appRoot && !appRoot.hasChildNodes() && framesWaited < MAX_FRAMES) {
      requestAnimationFrame(() => reveal(framesWaited + 1));
      return;
    }

    document.documentElement.classList.remove('has-prerender');
    document.getElementById('prerender')?.remove();

    // Signal used by scripts/prerender.mjs to know the page is fully rendered.
    window.__PRERENDER_READY__ = true;
  }

  function onFirstRoute() {
    router.off('routeDidChange', onFirstRoute);
    requestAnimationFrame(() => reveal(0));
  }

  router.on('routeDidChange', onFirstRoute);
}

export default { initialize };
