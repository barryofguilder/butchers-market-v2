import type { Validations } from '../utils/validators';

export default {
  // NOTE: Not adding file URL validation here since this only gets populated after upload.
  // fileUrl: [validatePresence()],
} satisfies Validations;
