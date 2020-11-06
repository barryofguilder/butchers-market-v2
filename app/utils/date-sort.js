import { isAfter, isBefore } from 'date-fns';

export default function (a, b) {
  let timeA = a.get('startTime');
  let timeB = b.get('startTime');

  if (isAfter(timeA, timeB)) {
    return 1;
  } else if (isBefore(timeA, timeB)) {
    return -1;
  }

  return 0;
}
