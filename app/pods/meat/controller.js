import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['packages'],
  packages: false,

  // TODO: Update to use new media breakpoint
  cardColumns: computed('media.isMobile', function() {
    return this.get('media.isMobile') ? 2 : 3;
  })
});
