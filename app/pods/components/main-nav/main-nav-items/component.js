import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  itemClicked() {},

  media: service(),

  isMobile: computed('media.{isLg,isXl}', function() {
    return !this.media.isLg && !this.media.isXl;
  }),
});
