import EmberRouter from '@ember/routing/router';
import config from 'butchers-market/config/environment';
import { inject as service } from '@ember/service';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;

  @service metrics;
  @service router;

  constructor() {
    super(...arguments);

    let ADMIN_ONLY = false;

    if (document && document.getElementById('admin-only')) {
      ADMIN_ONLY = true;
    }

    this.on('routeDidChange', () => {
      const page = this.router.currentURL;
      const title = this.router.currentRouteName || 'unknown';

      this.metrics.trackPage({ page, title });

      if (ADMIN_ONLY) {
        const routeName = this.router.currentRouteName;

        if (!routeName.startsWith('admin') && routeName !== 'down') {
          this.router.transitionTo('down');
        }
      }
    });
  }
}

Router.map(function () {
  this.route('contact');
  this.route('deli');
  this.route('meat');
  this.route('menu');

  this.route('down');

  this.route('sign-in');

  this.route('admin', function () {
    this.route('deli-items', function () {
      this.route('new');
      this.route('edit', { path: ':id/edit' });
      this.route('delete', { path: ':id/delete' });
    });
    this.route('hours', function () {
      this.route('new');
      this.route('edit', { path: ':id/edit' });
    });
    this.route('meat-bundles', function () {
      this.route('edit', { path: ':id/edit' });
    });
    this.route('package-bundles', function () {
      this.route('new');
      this.route('edit', { path: ':id/edit' });
      this.route('delete', { path: ':id/delete' });
    });
    this.route('specials', function () {
      this.route('new');
      this.route('edit', { path: ':id/edit' });
      this.route('delete', { path: ':id/delete' });
    });
  });
});
