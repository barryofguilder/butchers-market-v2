import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class EventsRoute extends Route {
  async model() {
    const events = await this.store.query('event', { filter: { range: 'upcoming' } });
    const hours = await this.store.findAll('hour');
    const performances = await this.store.findAll('performance');

    return {
      events,
      hours,
      performances,
    };
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
