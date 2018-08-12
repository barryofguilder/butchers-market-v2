import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
  metrics: service(),

  didTransition() {
    this._super(...arguments);

    this._trackPage();
  },

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.get('url');
      const title = this.getWithDefault('currentRouteName', 'unknown');

      this.get('metrics').trackPage({ page, title });
    });
  }
});

Router.map(function() {
  this.route('meat');
  this.route('deli');
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
    this.route('hours', function() {
      this.route('edit', { path: ':id' });
    });
  });
});

export default Router;
