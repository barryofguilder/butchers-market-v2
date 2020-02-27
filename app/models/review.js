import Model, { attr } from '@ember-data/model';

export default class Review extends Model {
  @attr('string') reviewer;
  @attr('string') imageUrl;
  @attr('string') text;
  @attr('string') source;
  @attr('string') url;
}
