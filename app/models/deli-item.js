import Model, { attr } from '@ember-data/model';

export default class DeliItem extends Model {
  @attr('string') title;
  @attr('string') image;
  @attr('string') ingredients;
}
