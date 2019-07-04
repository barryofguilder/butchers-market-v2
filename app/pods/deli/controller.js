import { computed } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  media: service(),

  cardColumns: computed('media.isMobile', function() {
    return this.get('media.isMobile') ? 2 : 4;
  }),
});
