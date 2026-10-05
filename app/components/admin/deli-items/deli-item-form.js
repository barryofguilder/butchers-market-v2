import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { dropTask, enqueueTask } from 'ember-concurrency';
import DeliItemValidations from '../../../validations/deli-item';
import FormState from '../../../utils/form-state';
import baseUrl from '../../../utils/base-url';
import { generateFileName } from '../../../utils/file-name';
import { getErrorMessageFromException } from '../../../utils/error-handling';

export default class DeliItemFormComponent extends Component {
  @service router;
  @service session;

  form = new FormState(this.args.item, DeliItemValidations);

  @tracked image;
  @tracked tempImageUrl;
  @tracked errorMessage;
  @tracked fileErrorMessage;

  get hasErrors() {
    return this.errorMessage || this.form.isInvalid;
  }

  get hasImage() {
    return this.form.get('imageUrl') || this.tempImageUrl;
  }

  get imageUrl() {
    if (this.tempImageUrl) {
      return this.tempImageUrl;
    }

    return this.form.get('imageUrlPath');
  }

  get saveDisabled() {
    return this.form.isInvalid;
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

  saveItem = dropTask(async () => {
    this.form.validate();

    if (!this.form.isValid) {
      return;
    }

    try {
      if (this.image) {
        const generatedFileName = generateFileName(this.image);
        await this.image.upload(`${baseUrl}/upload`, {
          headers: this.uploadHeaders,
          data: { generatedFileName },
        });
        this.form.set('imageUrl', generatedFileName);
      }

      await this.form.save();
      this.args.saved();
    } catch (ex) {
      if (ex.status === 401) {
        return this.session.redirectToSignIn(this.router.currentURL);
      } else {
        this.errorMessage = await getErrorMessageFromException(ex);
      }
    }
  });

  uploadPhoto = enqueueTask({ maxConcurrency: 3 }, async (file) => {
    try {
      let url = await file.readAsDataURL();
      this.tempImageUrl = url;
      this.image = file;

      // Only setting this to make the validation happy. It gets set to the actual url on save.
      this.form.set('imageUrl', url);
    } catch (ex) /* eslint-disable-line no-unused-vars */ {
      this.fileErrorMessage = 'Could not read the file contents';
    }
  });

  @action
  updateHidden() {
    this.form.set('isHidden', !this.form.get('isHidden'));
  }

  @action
  uploadImage(file) {
    this.uploadPhoto.perform(file);
  }

  @action
  removeImage() {
    this.image = null;
    this.tempImageUrl = null;

    this.form.set('imageUrl', null);
  }
}
