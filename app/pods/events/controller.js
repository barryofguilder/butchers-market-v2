import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

const PERFORMANCES_TO_SHOW = 11;

export default class EventsController extends Controller {
  @service media;

  get filteredPerformances() {
    let performances = this.model.performances;
    let performanceCount = performances.length;
    let randomPerformances = [];

    while (randomPerformances.length < performanceCount) {
      let performance = performances.objectAt(Math.floor(Math.random() * performanceCount));
      let found = randomPerformances.findBy('id', performance.id);

      if (found) {
        continue;
      }

      randomPerformances.pushObject(performance);
    }

    return randomPerformances.slice(0, PERFORMANCES_TO_SHOW);
  }
}
