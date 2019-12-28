import Model, { attr } from '@ember-data/model';

export default class DeliItem extends Model {
  @attr('string') title;
  @attr('string') imageUrl;
  @attr('string') ingredients;
}
