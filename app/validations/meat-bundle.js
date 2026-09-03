import { validatePresence } from 'ember-changeset-validations/validators';

export default {
  title: [validatePresence({ presence: true })],
  price: [validatePresence({ presence: true })],
  items: [validatePresence({ presence: true, message: 'Please add at least one item' })],
};
