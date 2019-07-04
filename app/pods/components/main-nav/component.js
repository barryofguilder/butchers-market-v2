import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';

export default Component.extend({
  tagName: '',

  media: service(),

  isMobile: computed('media.{isLg,isXl}', function() {
    return !this.media.isLg && !this.media.isXl;
  }),

  showNavigation: false,

  /* eslint-disable-next-line */
  *transition({ insertedSprites, removedSprites }) {
    for (let sprite of insertedSprites) {
      fadeIn(sprite);
    }
    for (let sprite of removedSprites) {
      fadeOut(sprite);
    }
  },

  actions: {
    toggleNavigation() {
      this.toggleProperty('showNavigation');
    },
  },
});
