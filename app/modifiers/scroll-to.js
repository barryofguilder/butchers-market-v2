import { modifier } from 'ember-modifier';

export default modifier((element, [shouldScroll = true]) => {
  if (shouldScroll) {
    element.scrollIntoView();
  }
});
