import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['store-hours'],

  hours: null,
  storeHours: computed('hours.@each.{type,active}', function() {
    let storeHours = this.get('hours').filter((hour) => {
      if (hour.get('type') === 'store' && hour.get('active')) {
        return hour;
      }
    });

    return storeHours.get('firstObject');
  })
});
