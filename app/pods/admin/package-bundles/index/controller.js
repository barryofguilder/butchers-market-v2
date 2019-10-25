import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';

export default Controller.extend({
  bundlesSort: Object.freeze(['displayOrder:asc']),
  sortedBundles: sort('model', 'bundlesSort'),
});
