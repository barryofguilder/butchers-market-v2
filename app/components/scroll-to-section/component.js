import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'section',

  scroller: Ember.inject.service(),

  shouldScroll: false,
  selector: null,

  didInsertElement() {
    this._super(...arguments);

    if (this.get('shouldScroll')) {
      // Offset is to make up for the fixed position of the navbar
      this.get('scroller').scrollVertical(this.get('selector'), {
        offset: -125
      });
    }
  }
});
