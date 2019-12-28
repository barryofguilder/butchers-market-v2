import Model, { attr } from '@ember-data/model';

export default class MeatBundle extends Model {
  @attr('string') title;
  @attr('string') price;
  @attr('boolean') featured;
  @attr items; // Array of strings
}
