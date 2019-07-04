import Component from '@ember/component';
import { computed } from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import PerformanceValidations from 'butchers-market/validations/performance';
import { task } from 'ember-concurrency';

export default Component.extend({
  performance: null,
  saved: null,
  cancelled: null,

  changeset: null,
  errorMessage: null,
  dialogTitle: computed('changeset.isNew', function() {
    return this.get('changeset.isNew') ? 'New Performance' : 'Edit Performance';
  }),
  saveDisabled: computed('changeset.isInvalid', function() {
    return this.get('changeset.isInvalid');
  }),

  init() {
    this._super(...arguments);

    let performance = this.get('performance');
    let changeset = new Changeset(
      performance,
      lookupValidator(PerformanceValidations),
      PerformanceValidations
    );
    this.set('changeset', changeset);
  },

  savePerformance: task(function*() {
    let changeset = this.get('changeset');

    yield changeset.validate();

    if (!changeset.get('isValid')) {
      return;
    }

    try {
      yield changeset.save();
      this.get('saved')();
    } catch (reason) {
      this.get('performance').rollbackAttributes();
      this.set('errorMessage', reason);
    }
  }).drop(),

  actions: {
    close() {
      this.get('cancelled')();
    },
  },
});
