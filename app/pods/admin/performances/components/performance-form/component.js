import Component from '@ember/component';
import { computed } from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import PerformanceValidations from 'butchers-market/validations/performance';
import { task } from 'ember-concurrency';

export default Component.extend({
  performance: null,
  saved() {},
  cancelled() {},

  changeset: null,
  errorMessage: null,
  saveDisabled: computed('changeset.isInvalid', function() {
    return this.get('changeset.isInvalid');
  }),

  init() {
    this._super(...arguments);

    let changeset = new Changeset(
      this.performance,
      lookupValidator(PerformanceValidations),
      PerformanceValidations
    );
    this.set('changeset', changeset);
  },

  savePerformance: task(function*() {
    yield this.changeset.validate();

    if (!this.changeset.get('isValid')) {
      return;
    }

    try {
      yield this.changeset.save();
      this.saved();
    } catch (ex) {
      if (ex.body) {
        this.set('errorMessage', ex.body.error);
      } else {
        this.set('errorMessage', ex);
      }
    }
  }).drop(),
});
