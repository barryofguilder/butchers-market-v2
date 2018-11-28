import { validatePresence, validateLength } from 'ember-changeset-validations/validators';

export default {
  label: [
    validatePresence({ presence: true })
  ],
  line1: [
    validatePresence({ presence: true, description: 'Line 1', }),
    validateLength({ max: 50, description: 'Line 1' })
  ],
  line2: [
    validateLength({ max: 50, description: 'Line 2' })
  ],
  line3: [
    validateLength({ max: 50, description: 'Line 3' })
  ]
};
