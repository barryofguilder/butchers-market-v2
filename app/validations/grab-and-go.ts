import { validatePresence, type Validations } from '../utils/validators';

export default {
  title: [validatePresence()],
  // NOTE: Not adding image URL validation here since this only gets populated after upload.
  // imageUrl: [validatePresence()],
} satisfies Validations;
