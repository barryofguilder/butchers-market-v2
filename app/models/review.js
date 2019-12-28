import Model, { attr } from '@ember-data/model';

export default class Review extends Model {
  @attr('string') text;
  @attr('string') reviewer;
  @attr('string') source;
  @attr('string') url;
  @attr('string') image;
}
