import Model, { attr } from '@ember-data/model';

export default class FeatureFlag extends Model {
  @attr() declare name: string;
  @attr() declare active: boolean;
}
