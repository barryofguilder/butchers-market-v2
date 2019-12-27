import Model, { attr } from '@ember-data/model';
import { isBlank } from '@ember/utils';

export default class Performance extends Model {
  @attr('string') title;
  @attr('string') link;

  get embedLink() {
    if (isBlank(this.link)) {
      return null;
    }

    let embedLink = this.link.replace('watch?v=', 'embed/');
    let paramIndex = embedLink.indexOf('&');

    if (paramIndex > 0) {
      embedLink = embedLink.substring(0, paramIndex);
    }

    return embedLink;
  }
}
