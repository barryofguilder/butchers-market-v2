import EmberRouter from '@ember/routing/router';
import config from 'butchers-market/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('cafe');
  // Drew doesn't want the contact form anymore. Commenting this out instead of deleting in case he
  // changes his mind.
  // this.route('contact');
  this.route('deli');
  this.route('grab-and-go');
  this.route('meat');

  this.route('sign-in');

  this.route('admin', function () {
    this.route('deli-items', function () {
      this.route('new');
      this.route('edit', { path: ':id/edit' });
      this.route('delete', { path: ':id/delete' });
    });
    this.route('feature-flags', function () {
      this.route('new');
      this.route('edit', { path: ':id/edit' });
      this.route('delete', { path: ':id/delete' });
    });
    this.route('grab-and-go', function () {
      this.route('new');
      this.route('edit', { path: ':id/edit' });
      this.route('delete', { path: ':id/delete' });
      this.route('social');
    });
    this.route('hours', function () {
      this.route('new');
      this.route('edit', { path: ':id/edit' });
    });
    this.route('meat-bundles', function () {
      this.route('edit', { path: ':id/edit' });
    });
    this.route('menu', function () {
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

  // START TEST ROUTES
  // These routes are only used for component tests.
  this.route('test-route', function () {
    this.route('model-route', { path: '/:id' }, function () {
      this.route('second-model-route', { path: '/tag/:tag' });
    });
  });
  // END TEST ROUTES

  this.route('not-found', { path: '/*path' });
});
