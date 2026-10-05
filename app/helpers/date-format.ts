import { helper } from '@ember/component/helper';
import { format } from 'date-fns';

export function dateFormat([date, dateFormat]: [Date | null | undefined, string]) {
  if (date) {
    return format(date, dateFormat);
  }

  return date;
}

export default helper(dateFormat);
