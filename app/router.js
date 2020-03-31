import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { inject as service } from '@ember/service';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;

  @service metrics;
  @service router;

  constructor() {
    super(...arguments);

    this.on('routeDidChange', () => {
      const page = this.router.currentURL;
      const title = this.router.currentRouteName || 'unknown';

      this.metrics.trackPage({ page, title });
    });
  }
}

Router.map(function() {
  this.route('contact');
  this.route('deli');
  this.route('events');
  this.route('meat');
  this.route('menu');

  this.route('admin', function() {
    this.route('deli-items', function() {
      this.route('new');
      this.route('edit', { path: ':id/edit' });
      this.route('delete', { path: ':id/delete' });
    });
    this.route('events', function() {
      this.route('new');
      this.route('edit', { path: ':id/edit' });
      this.route('delete', { path: ':id/delete' });
    });
    this.route('performances', function() {
      this.route('new');
      this.route('edit', { path: ':id/edit' });
    });
    this.route('hours', function() {
      this.route('new');
      this.route('edit', { path: ':id/edit' });
    });
    this.route('package-bundles', function() {
      this.route('new');
      this.route('edit', { path: ':id/edit' });
      this.route('delete', { path: ':id/delete' });
    });
  });
});
