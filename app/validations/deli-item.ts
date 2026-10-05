import { validatePresence, type Validations } from '../utils/validators';

export default {
  title: [validatePresence()],
  imageUrl: [validatePresence()],
} satisfies Validations;
