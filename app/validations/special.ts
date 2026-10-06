import { validatePresence, type Validations } from '../utils/validators';

export default {
  title: [validatePresence()],
  imageAltText: [validatePresence()],
  imageUrl: [validatePresence()],
} satisfies Validations;
