import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import DeliItemValidations from 'butchers-market/validations/deli-item';
import { task } from 'ember-concurrency';

export default class DeliItemForm extends Component {
  changeset;

  @tracked errorMessage;
  @tracked fileErrorMessage;

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
      let image = this.changeset.get('image');

      if (image) {
        let response = yield image.upload('/server/imageUpload.php');
        this.changeset.set('imageUrl', response.headers.location);
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
      this.changeset.set('imageUrl', url);
      this.changeset.set('image', file);
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
}
