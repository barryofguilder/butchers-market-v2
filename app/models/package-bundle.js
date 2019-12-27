import Model, { attr } from '@ember-data/model';

export default class PackageBundle extends Model {
  @attr('string') title;
  @attr('number') displayOrder;
  @attr('string') flyerDownloadLink;
  @attr prices; // Array of strings
  @attr items; // Array of strings
}
