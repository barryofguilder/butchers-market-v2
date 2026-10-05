import { validateLength, validatePresence, type Validations } from '../utils/validators';

export default {
  label: [validatePresence()],
  line1: [
    validatePresence({ description: 'Line 1' }),
    validateLength({ max: 50, description: 'Line 1' }),
  ],
  line2: [validateLength({ max: 50, description: 'Line 2' })],
  line3: [validateLength({ max: 50, description: 'Line 3' })],
} satisfies Validations;
