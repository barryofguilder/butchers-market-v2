import { filterBy } from '@ember/object/computed';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  media: service(),

  featuredBundles: filterBy('model.bundles', 'featured', true),
});
