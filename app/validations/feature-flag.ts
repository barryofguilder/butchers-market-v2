import { validatePresence, type Validations } from '../utils/validators';

export default {
  name: [validatePresence()],
} satisfies Validations;
