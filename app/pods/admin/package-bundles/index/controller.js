import Controller from '@ember/controller';
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { sort } from '@ember/object/computed';

export default class AdminPackageBundlesIndexController extends Controller {
  bundlesSort = ['displayOrder:asc'];

  @sort('model', 'bundlesSort')
  sortedBundles;
}
