import Controller from '@ember/controller';
import MediaMixin from '../mixins/media-mixin';
import { computed } from '@ember/object';

const PERFORMANCES_TO_SHOW = 5;

export default Controller.extend(MediaMixin, {
  queryParams: ['events'],
  events: false,

  filteredPerformances: computed('model.performances', function() {
    let performances = this.get('model.performances');
    let performanceCount = performances.get('length');
    let randomPerformances = [];

    while (randomPerformances.get('length') < performanceCount) {
      let performance = performances.objectAt(Math.floor(Math.random() * performanceCount));

      let found = randomPerformances.findBy('id', performance.get('id'));

      if (found) {
        continue;
      }

      randomPerformances.pushObject(performance);
    }

    return randomPerformances.slice(0, PERFORMANCES_TO_SHOW);
  })
});
