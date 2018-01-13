import { filterBy } from '@ember/object/computed';
import Controller from '@ember/controller';
import MediaMixin from 'butchers-market/mixins/media-mixin';

export default Controller.extend(MediaMixin, {
  featuredBundles: filterBy('model.bundles', 'featured', true)
});
