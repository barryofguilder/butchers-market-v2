import { validatePresence } from 'ember-changeset-validations/validators';

export default {
  title: [validatePresence({ presence: true })],
  imageUrl: [validatePresence({ presence: true })],
};
