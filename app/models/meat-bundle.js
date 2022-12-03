import Model, { attr } from '@ember-data/model';

export default class MeatBundle extends Model {
  @attr('number') displayOrder;
  @attr('string') title;
  @attr('string') price;
  @attr('boolean') featured;
  @attr('string') specialText;
  @attr('boolean') isHidden;
  @attr('boolean') orderEnabled;
  @attr items; // Array of strings
}
