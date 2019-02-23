export default function() {
  const args = Array.prototype.slice.call(arguments);

  return args
    .map(arg => {
      if (arg[0] === '.') {
        return arg;
      }

      return `[data-test-id="${arg}"]`;
    })
    .join(' ');
}
