import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'nav',
  classNames: ['navbar', 'navbar-light', 'fixed-top', 'navbar-expand-lg'],

  currentRouteName: computed('applicationRoute.controller.currentRouteName', function() {
    let currentRouteName = this.get('applicationRoute.controller.currentRouteName');
    return currentRouteName || '';
  }),

  isEventsPage: computed('currentRouteName', function() {
    let currentRouteName = this.get('currentRouteName');

    return currentRouteName === 'events';
  }),

  contactText: computed('isEventsPage', function() {
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
