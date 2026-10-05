import { validatePresence, type Validations } from '../utils/validators';

export default {
  title: [validatePresence()],
  imageAltText: [validatePresence()],
  // NOTE: Not adding image URL validation here since this only gets populated after upload.
  // imageUrl: [validatePresence()],
} satisfies Validations;
