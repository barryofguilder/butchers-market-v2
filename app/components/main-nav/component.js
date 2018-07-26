import { computed } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'header',
  classNames: 'fixed pin-t pin-x flex justify-between bg-white px-4 h-20',

  router: service(),

  _currentURL: null,
  showNav: computed('router.currentURL', {
    get() {
      if (this.get('_currentURL') !== this.get('router.currentURL')) {
        this.set('_currentURL', this.get('router.currentURL'));
        return false;
      }

      return false;
    },
    set(key, value) {
      return value;
    }
  }),
  navClass: computed('showNav', function() {
    return this.get('showNav') ? '' : 'hidden';
  }),
  showDiningDropdown: false,

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
  },

  actions: {
    toggleNav() {
      this.toggleProperty('showNav');
    },

    toggleDiningDropdown() {
      this.toggleProperty('showDiningDropdown');
    },

    dropdownClosed(isDisplayed) {
      if (!isDisplayed) {
        this.set('showDiningDropdown', false);
      }
    }
  }
});
