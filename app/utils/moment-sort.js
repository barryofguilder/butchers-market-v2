import moment from 'moment';

export default function(a, b) {
  let timeA = moment(a.get('startTime'));
  let timeB = moment(b.get('startTime'));

  if (timeA.isAfter(timeB)) {
    return 1;
  } else if (timeA.isBefore(timeB)) {
    return -1;
  }

  return 0;
}
