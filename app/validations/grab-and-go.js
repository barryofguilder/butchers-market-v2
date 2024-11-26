import { validatePresence } from 'ember-changeset-validations/validators';

export default {
  title: [validatePresence({ presence: true })],
  // NOTE: Not adding image URL validation here since this only gets populated after upload.
  // imageUrl: [validatePresence({ presence: true })],
};
