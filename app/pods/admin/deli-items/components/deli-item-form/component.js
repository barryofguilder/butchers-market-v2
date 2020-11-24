import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import DeliItemValidations from 'butchers-market/validations/deli-item';
import { dropTask, enqueueTask } from 'ember-concurrency-decorators';
import baseUrl from 'butchers-market/utils/base-url';

export default class DeliItemForm extends Component {
  @service router;
  @service session;

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

  get uploadHeaders() {
    const token = this.session.token;

    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }

    return null;
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

  @dropTask
  *saveItem() {
    yield this.changeset.validate();

    if (!this.changeset.isValid) {
      return;
    }

    try {
      if (this.image) {
        let response = yield this.image.upload(`${baseUrl}/upload`, {
          headers: this.uploadHeaders,
        });
        this.changeset.set('imageUrl', response.body);
      }

      yield this.changeset.save();
      this.args.saved();
    } catch (ex) {
      if (ex.status === 401) {
        return this.session.redirectToSignIn(this.router.currentURL);
      } else if (ex.body) {
        this.errorMessage = ex.body.error;
      } else {
        this.errorMessage = ex;
      }
    }
  }

  @enqueueTask({ maxConcurrency: 3 })
  *uploadPhoto(file) {
    try {
      let url = yield file.readAsDataURL();
      this.tempImageUrl = url;
      this.image = file;

      // Only setting this to make the validation happy. It gets set to the actual url on save.
      this.changeset.set('imageUrl', url);
    } catch (e) {
      this.fileErrorMessage = 'Could not read the file contents';
    }
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
