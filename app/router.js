import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
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
      this.route('edit', { path: ':eventId' });
    });
  });
});

export default Router;
