import { computed } from '@ember/object';
import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  tagName: 'nav',
  classNames: ['navbar', 'navbar-light', 'fixed-top', 'navbar-expand-lg'],
  navbarClickHandler: '.nav-item:not(.dropdown), .navbar-brand, .dropdown-item',

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

    this.$().on('click', this.navbarClickHandler, this.collapseNavbar);
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().off('click', this.navbarClickHandler, this.collapseNavbar);
  },

  collapseNavbar() {
    const toggler = $('.navbar-toggler');
    const navbarCollapse = $('.navbar-collapse');

    if (navbarCollapse.hasClass('show')) {
      toggler.click();
    }
  }
});
