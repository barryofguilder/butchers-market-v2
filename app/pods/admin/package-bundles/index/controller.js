import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';

export default class AdminPackageBundlesIndexController extends Controller {
  bundlesSort = ['displayOrder:asc'];

  @sort('model', 'bundlesSort')
  sortedBundles;
}
