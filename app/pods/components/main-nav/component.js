import { computed } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  tagName: 'nav',

  router: service(),

  classNames: ['navbar', 'navbar-light', 'fixed-top', 'navbar-expand-lg'],
  navbarClickHandler: '.nav-item:not(.dropdown), .navbar-brand, .dropdown-item',

  isEventsPage: computed('router.currentRouteName', function() {
    let currentRouteName = this.get('router.currentRouteName');

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
