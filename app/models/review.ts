import Model, { attr } from '@ember-data/model';

export default class Review extends Model {
  @attr() declare reviewer: string;
  @attr() declare imageUrl: string;
  @attr() declare text: string;
  @attr() declare source: string;
  @attr() declare url: string;
  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;
}
