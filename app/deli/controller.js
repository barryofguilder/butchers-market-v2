import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
  cardColumns: computed('media.isMobile', function() {
    return this.get('media.isMobile') ? 2 : 4;
  })
});
