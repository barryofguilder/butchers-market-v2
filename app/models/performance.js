import DS from 'ember-data';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';

export default DS.Model.extend({
  title: DS.attr('string'),
  link: DS.attr('string'),

  embedLink: computed('link', function() {
    let link = this.get('link');

    if (isBlank(link)) {
      return;
    }

    let embedLink = link.replace('watch?v=', 'embed/');
    let paramIndex = embedLink.indexOf('&');

    if (paramIndex > 0) {
      embedLink = embedLink.substring(0, paramIndex);
    }

    return embedLink;
  })
});
