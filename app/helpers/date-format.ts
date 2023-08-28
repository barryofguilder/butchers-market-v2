import { helper } from '@ember/component/helper';
import { format } from 'date-fns';

export function dateFormat([date, dateFormat]: [Date, string]) {
  if (date) {
    return format(date, dateFormat);
  }

  return date;
}

export default helper(dateFormat);
