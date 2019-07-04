import Component from '@ember/component';

export default Component.extend({
  tagName: 'tr',

  currentSort: null,
  onColumnClicked: null,
});
