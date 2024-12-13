import Model, { attr } from '@ember-data/model';

export default class MeatBundle extends Model {
  @attr() declare displayOrder: number;
  @attr() declare title: string;
  @attr() declare price: string;
  @attr() declare featured: boolean;
  @attr() declare specialText: string;
  @attr() declare isHidden: boolean;
  @attr() declare orderEnabled: boolean;
  @attr() declare items: string[];
  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;
}
