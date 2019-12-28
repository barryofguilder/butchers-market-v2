import makeFunctionalModifier from 'ember-functional-modifiers';

export default makeFunctionalModifier((element, [shouldScroll = true]) => {
  if (shouldScroll) {
    element.scrollIntoView();
  }
});
