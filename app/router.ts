import EmberRouter from '@ember/routing/router';
import config from 'butchers-market/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  // Drew doesn't want the contact form anymore. Commenting this out instead of deleting in case he
  // changes his mind.
  // this.route('contact');
  this.route('deli');
  this.route('meat');

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

  this.route('not-found', { path: '/*path' });
});
