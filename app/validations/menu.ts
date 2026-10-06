import { validatePresence, type Validations } from '../utils/validators';

export default {
  fileUrl: [validatePresence({ description: 'PDF' })],
} satisfies Validations;
