export default function(a, b) {
  let timeA = a.get('momentStartTime');
  let timeB = b.get('momentStartTime');

  if (timeA.isAfter(timeB)) {
    return 1;
  } else if (timeA.isBefore(timeB)) {
    return -1;
  }

  return 0;
}
