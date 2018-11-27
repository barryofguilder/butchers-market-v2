import { validatePresence, validateLength } from 'ember-changeset-validations/validators';

export default {
  label: [
    validatePresence({ presence: true, message: 'Type can\'t be blank' })
  ],
  line1: [
    validatePresence({ presence: true, message: 'Line 1 can\'t be blank' }),
    validateLength({ max: 50, message: 'Line 1 is too long (maximum is 50 characters)' })
  ],
  line2: [
    validateLength({ max: 50, message: 'Line 2 is too long (maximum is 50 characters)' })
  ],
  line3: [
    validateLength({ max: 50, message: 'Line 3 is too long (maximum is 50 characters)' })
  ]
};
