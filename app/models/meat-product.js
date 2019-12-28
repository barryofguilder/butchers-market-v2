import Model, { attr } from '@ember-data/model';

export default class MeatProduct extends Model {
  @attr('string') title;
  @attr('boolean') featured;
  @attr items; // Array of strings
}
