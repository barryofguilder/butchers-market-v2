import { bool } from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['events'],
  events: false,

  isEventsPage: bool('events'),
});
