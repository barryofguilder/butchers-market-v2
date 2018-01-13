import Component from '@ember/component';
import { computed } from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import EventValidations from 'butchers-market/event/validations';
import { task } from 'ember-concurrency';

export default Component.extend({
  event: null,
  saved: null,
  cancelled: null,

  changeset: null,
  errorMessage: null,
  dialogTitle: computed('event.isNew', function() {
    return this.get('event.isNew') ? 'New Event' : 'Edit Event';
  }),
  saveDisabled: computed('changeset.isInvalid', function() {
    return this.get('changeset.isInvalid');
  }),

  init() {
    this._super(...arguments);

    let event = this.get('event');

    if (event.get('isNew')) {
      let now = new Date();

      event.setProperties({
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22)
      });
    }

    let changeset = new Changeset(event, lookupValidator(EventValidations), EventValidations);
    this.set('changeset', changeset);
  },

  saveEvent: task(function * () {
    let changeset = this.get('changeset');

    yield changeset.validate();

    if (!changeset.get('isValid')) {
      return;
    }

    try {
      yield changeset.save();
      this.get('saved')();
    } catch (reason) {
      this.get('event').rollbackAttributes();
      this.set('errorMessage', reason);
    }
  }).drop(),

  actions: {
    close() {
      this.get('cancelled')();
    }
  }
});
