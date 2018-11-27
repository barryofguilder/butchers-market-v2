import Component from '@ember/component';
import { computed } from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import EventValidations from 'butchers-market/validations/event';
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

    let changeset = new Changeset(this.event, lookupValidator(EventValidations), EventValidations);

    if (changeset.get('isNew')) {
      let now = new Date();

      changeset.setProperties({
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22)
      });
    }

    this.set('changeset', changeset);
  },

  saveEvent: task(function * () {
    yield this.changeset.validate();

    if (!this.changeset.get('isValid')) {
      return;
    }

    try {
      yield this.changeset.save();
      this.saved();
    } catch (reason) {
      this.event.rollbackAttributes();
      this.set('errorMessage', reason);
    }
  }).drop(),

  actions: {
    dateSelected(date) {
      const startTime = this.changeset.get('startTime');
      this.changeset.set('startTime', new Date(date[0].getFullYear(), date[0].getMonth(), date[0].getDate(), startTime.getHours(), startTime.getMinutes()));
    },

    startTimeSelected(time) {
      const startTime = this.changeset.get('startTime');
      this.changeset.set('startTime', new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), time[0].getHours(), time[0].getMinutes()));
    },

    endTimeSelected(time) {
      const startTime = this.changeset.get('startTime');
      this.changeset.set('endTime', new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), time[0].getHours(), time[0].getMinutes()));
    }
  }
});
