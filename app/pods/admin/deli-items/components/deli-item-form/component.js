import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import DeliItemValidations from 'butchers-market/validations/deli-item';
import { task } from 'ember-concurrency';
import baseUrl from 'butchers-market/utils/base-url';

export default class DeliItemForm extends Component {
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
      this.args.item,
      lookupValidator(DeliItemValidations),
      DeliItemValidations
    );
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
  saveItem;

  @(task(function*(file) {
    try {
      let url = yield file.readAsDataURL();
      this.tempImageUrl = url;
      this.image = file;

      // Only setting this to make the validation happy. It gets set to the actual url on save.
      this.changeset.set('imageUrl', url);
    } catch (e) {
      this.fileErrorMessage = 'Could not read the file contents';
    }
  })
    .maxConcurrency(3)
    .enqueue())
  uploadPhoto;

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
