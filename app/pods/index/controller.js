import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { filterBy } from '@ember/object/computed';

export default class IndexController extends Controller {
  @service media;

  @filterBy('model.bundles', 'featured', true)
  featuredBundles;
}
