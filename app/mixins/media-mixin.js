import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({
  isDesktop: computed('media.{isLg,isXl}', function() {
    return this.media.isLg || this.media.isXl;
  }),
  notDesktop: computed('media.{isSm,isMd}', function() {
    return this.media.isSm || this.media.isMd;
  }),
});
