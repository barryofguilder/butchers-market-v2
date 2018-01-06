import { bool, not } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  isDesktop: bool('media.isDesktop'),
  notDesktop: not('media.isDesktop')
});
