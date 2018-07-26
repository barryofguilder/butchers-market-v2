import Component from '@ember/component';

export default Component.extend({
  tagName: 'a',
  classNames: 'no-underline inline-block h-8 w-8 pt-1 text-center text-xl text-black border rounded border-grey-darkest hover:bg-grey-darkest hover:text-white',
  attributeBindings: ['href'],

  href: null
});
