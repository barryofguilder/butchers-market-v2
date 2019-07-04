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
  fileErrorMessage: null,
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
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22),
      });
    }

    this.set('changeset', changeset);
  },

  saveEvent: task(function*() {
    yield this.changeset.validate();

    if (!this.changeset.get('isValid')) {
      return;
    }

    try {
      let image = this.changeset.get('image');

      if (image) {
        let response = yield image.upload('/server/imageUpload.php');
        this.changeset.set('imageUrl', response.headers.location);
      }

      yield this.changeset.save();
      this.saved();
    } catch (ex) {
      if (ex.body) {
        this.set('errorMessage', ex.body.error);
      } else {
        this.set('errorMessage', ex);
      }

      this.event.rollbackAttributes();
    }
  }).drop(),

  uploadPhoto: task(function*(file) {
    try {
      let url = yield file.readAsDataURL();
      this.changeset.setProperties({
        imageUrl: url,
        image: file,
      });
    } catch (e) {
      this.set('fileErrorMessage', 'Could not read the file contents');
    }
  })
    .maxConcurrency(3)
    .enqueue(),

  actions: {
    dateSelected(date) {
      const startTime = this.changeset.get('startTime');
      this.changeset.set(
        'startTime',
        new Date(
          date[0].getFullYear(),
          date[0].getMonth(),
          date[0].getDate(),
          startTime.getHours(),
          startTime.getMinutes()
        )
      );
    },

    startTimeSelected(time) {
      const startTime = this.changeset.get('startTime');
      this.changeset.set(
        'startTime',
        new Date(
          startTime.getFullYear(),
          startTime.getMonth(),
          startTime.getDate(),
          time[0].getHours(),
          time[0].getMinutes()
        )
      );
    },

    endTimeSelected(time) {
      const startTime = this.changeset.get('startTime');
      this.changeset.set(
        'endTime',
        new Date(
          startTime.getFullYear(),
          startTime.getMonth(),
          startTime.getDate(),
          time[0].getHours(),
          time[0].getMinutes()
        )
      );
    },

    uploadImage(file) {
      this.uploadPhoto.perform(file);
    },
  },
});
