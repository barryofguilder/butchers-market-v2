import { bool, not } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  media: service(),

  isDesktop: bool('media.isDesktop'),
  notDesktop: not('media.isDesktop')
});
