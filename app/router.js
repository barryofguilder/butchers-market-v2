import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('meat');
  this.route('deli');
  this.route('beverage');
  this.route('contact');
  this.route('events');

  this.route('admin', function() {
    this.route('events', function() {
      this.route('new');
      this.route('edit', { path: ':id' });
    });
    this.route('performances', function() {
      this.route('new');
      this.route('edit', { path: ':id' });
    });
  });
});

export default Router;
