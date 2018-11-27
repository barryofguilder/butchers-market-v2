import Component from '@ember/component';
import { computed } from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import HoursValidations from 'butchers-market/validations/hour';
import { task } from 'ember-concurrency';

export default Component.extend({
  hours: null,
  saved: null,
  cancelled: null,

  changeset: null,
  errorMessage: null,
  saveDisabled: computed('changeset.isInvalid', function() {
    return this.get('changeset.isInvalid');
  }),

  init() {
    this._super(...arguments);

    let hours = this.get('hours');
    let changeset = new Changeset(hours, lookupValidator(HoursValidations), HoursValidations);
    this.set('changeset', changeset);
  },

  saveHours: task(function * () {
    let changeset = this.get('changeset');

    yield changeset.validate();

    if (!changeset.get('isValid')) {
      return;
    }

    try {
      yield changeset.save();
      this.get('saved')();
    } catch (reason) {
      this.get('hours').rollbackAttributes();
      this.set('errorMessage', reason);
    }
  }).drop(),

  actions: {
    close() {
      this.get('cancelled')();
    }
  }
});
