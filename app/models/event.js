import Model, { attr } from '@ember-data/model';

export default class Event extends Model {
  @attr('string') title;
  @attr('string') leadIn;
  @attr('date') startTime;
  @attr('date') endTime;
  @attr('string') link;
  @attr('string') imageUrl;
}
