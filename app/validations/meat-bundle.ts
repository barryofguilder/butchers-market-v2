import { validatePresence, type Validations } from '../utils/validators';

export default {
  title: [validatePresence()],
  price: [validatePresence()],
  items: [validatePresence({ message: 'Please add at least one item' })],
} satisfies Validations;
