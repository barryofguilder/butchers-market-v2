import Model, { attr } from '@ember-data/model';

export default class FeatureFlag extends Model {
  @attr() declare name: string;
  @attr() declare active: boolean;
  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;
}
