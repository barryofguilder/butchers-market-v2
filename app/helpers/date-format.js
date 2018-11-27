import { helper } from '@ember/component/helper';
import { format } from 'date-fns';

export function dateFormat([date, dateFormat]) {
  return format(date, dateFormat);
}

export default helper(dateFormat);
