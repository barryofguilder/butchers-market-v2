import Mixin from '@ember/object/mixin';

export default Mixin.create({
  actions: {
    willTransition: function(/*transition*/) {
      this._super(...arguments);

      window.scrollTo(0, 0);
    },
  },
});
