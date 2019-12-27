import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';

export default class AdminHoursIndexController extends Controller {
  hoursSort = ['default:desc', 'type:desc', 'label:asc'];

  @sort('model', 'hoursSort')
  sortedHours;
}
