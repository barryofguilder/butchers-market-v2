import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  events: null,
  isAdmin: false,

  eventColumns: computed('media.isMobile', function() {
    return this.get('media.isMobile') ? 1 : 2;
  })
});
