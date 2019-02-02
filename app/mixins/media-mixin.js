import { bool, not } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  // TODO: Update to use new media breakpoint
  isDesktop: bool('media.isDesktop'),
  // TODO: Update to use new media breakpoint
  notDesktop: not('media.isDesktop')
});
