import { validatePresence } from 'ember-changeset-validations/validators';

export default {
  title: [validatePresence({ presence: true })],
  startTime: [validatePresence({ presence: true })],
  endTime: [validatePresence({ presence: true })],
};
