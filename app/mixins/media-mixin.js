import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Mixin.create({
  media: service(),

  isDesktop: computed('media.{isLg,isXl}', function() {
    return this.media.isLg || this.media.isXl;
  }),
  notDesktop: computed('media.{isSm,isMd}', function() {
    return this.media.isSm || this.media.isMd;
  }),
});
