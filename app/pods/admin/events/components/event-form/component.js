import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import EventValidations from 'butchers-market/validations/event';
import { task } from 'ember-concurrency';
import baseUrl from 'butchers-market/utils/base-url';

export default class EventForm extends Component {
  changeset;

  @tracked image;
  @tracked tempImageUrl;
  @tracked errorMessage;
  @tracked fileErrorMessage;

  get hasImage() {
    return this.changeset.get('imageUrl') || this.tempImageUrl;
  }

  get imageUrl() {
    if (this.tempImageUrl) {
      return this.tempImageUrl;
    }

    return this.changeset.get('imageUrlPath');
  }

  get saveDisabled() {
    return this.changeset && this.changeset.isInvalid;
  }

  constructor() {
    super(...arguments);

    let changeset = new Changeset(
      this.args.event,
      lookupValidator(EventValidations),
      EventValidations
    );

    if (this.args.event.isNew) {
      let now = new Date();

      changeset.set('startTime', new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19));
      changeset.set('endTime', new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22));
    }

    this.changeset = changeset;
  }

  @(task(function*() {
    yield this.changeset.validate();

    if (!this.changeset.isValid) {
      return;
    }

    try {
      if (this.image) {
        let response = yield this.image.upload(`${baseUrl}/upload`);
        this.changeset.set('imageUrl', response.body);
      }

      yield this.changeset.save();
      this.args.saved();
    } catch (ex) {
      if (ex.body) {
        this.errorMessage = ex.body.error;
      } else {
        this.errorMessage = ex;
      }
    }
  }).drop())
  saveEvent;

  @(task(function*(file) {
    try {
      let url = yield file.readAsDataURL();
      this.tempImageUrl = url;
      this.image = file;
    } catch (e) {
      this.fileErrorMessage = 'Could not read the file contents';
    }
  })
    .maxConcurrency(3)
    .enqueue())
  uploadPhoto;

  @action
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

    const endTime = this.changeset.get('endTime');
    this.changeset.set(
      'endTime',
      new Date(
        date[0].getFullYear(),
        date[0].getMonth(),
        date[0].getDate(),
        endTime.getHours(),
        endTime.getMinutes()
      )
    );
  }

  @action
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

    const endTime = this.changeset.get('endTime');
    this.changeset.set(
      'endTime',
      new Date(
        startTime.getFullYear(),
        startTime.getMonth(),
        startTime.getDate(),
        endTime.getHours(),
        endTime.getMinutes()
      )
    );
  }

  @action
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
  }

  @action
  uploadImage(file) {
    this.uploadPhoto.perform(file);
  }

  @action
  removeImage() {
    this.image = null;
    this.tempImageUrl = null;

    this.changeset.set('imageUrl', null);
  }
}
