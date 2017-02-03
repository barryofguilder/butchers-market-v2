import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['navbar', 'navbar-default', 'navbar-fixed-top', 'main-nav'],

  currentRouteName: Ember.computed('applicationRoute.controller.currentRouteName', function() {
    let currentRouteName = this.get('applicationRoute.controller.currentRouteName');
    return currentRouteName || '';
  }),

  isEventsPage: Ember.computed('currentRouteName', function() {
    let currentRouteName = this.get('currentRouteName');

    return currentRouteName === 'events';
  }),

  contactText: Ember.computed('isEventsPage', function() {
    let isEventsPage = this.get('isEventsPage');

    return isEventsPage ? 'Contact, Booking, & Private Parties' : 'Contact';
  }),

  didInsertElement() {
    this._super(...arguments);

    this.$('.nav-item:not(.dropdown), .navbar-brand, .dropdown-item').click(() => {
      let toggler = this.$('.navbar-toggler');

      if (!toggler.hasClass('collapsed')) {
        toggler.click();
      }
    });
  }
});
