import Model, { attr } from '@ember-data/model';

export default class Hour extends Model {
  @attr({ defaultValue: 'Store' }) declare type: string;
  @attr() declare default: boolean;
  @attr('date') declare activeStartDate: Date;
  @attr('date') declare activeEndDate: Date;
  @attr() declare label: string;
  @attr() declare line1: string;
  @attr() declare line2: string;
  @attr() declare line3: string;
}
