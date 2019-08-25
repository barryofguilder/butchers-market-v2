import { computed } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  media: service(),

  cardColumns: computed('media.isMd', function() {
    return this.get('media.isMd') ? 2 : 4;
  }),
});
