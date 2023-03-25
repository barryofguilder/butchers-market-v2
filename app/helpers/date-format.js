import { helper } from '@ember/component/helper';
import { format } from 'date-fns';

export function dateFormat([date, dateFormat]) {
  if (date) {
    return format(date, dateFormat);
  }

  return date;
}

export default helper(dateFormat);
