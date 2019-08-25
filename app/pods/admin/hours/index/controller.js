import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';

export default Controller.extend({
  hoursSort: Object.freeze(['default:desc', 'type:desc', 'label:asc']),
  sortedHours: sort('model', 'hoursSort'),
});
