import Model, { attr } from '@ember-data/model';

export default class Hour extends Model {
  @attr('string', { defaultValue: 'Store' }) type;
  @attr('boolean') default;
  @attr('date') activeStartDate;
  @attr('date') activeEndDate;
  @attr('string') label;
  @attr('string') line1;
  @attr('string') line2;
  @attr('string') line3;
}
