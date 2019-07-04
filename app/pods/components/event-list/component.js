import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  media: service(),

  events: null,
  isAdmin: false,

  eventColumns: computed('media.isMd', function() {
    return this.get('media.isMd') ? 1 : 2;
  }),
});
