import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { dropTask, enqueueTask } from 'ember-concurrency';
import DeliItemValidations from '../../../validations/deli-item';
import baseUrl from '../../../utils/base-url';
import { generateFileName } from '../../../utils/file-name';
import { getErrorMessageFromException } from '../../../utils/error-handling';

export default class DeliItemFormComponent extends Component {
  @service router;
  @service session;

  changeset;

  @tracked image;
  @tracked tempImageUrl;
  @tracked errorMessage;
  @tracked fileErrorMessage;

  get hasErrors() {
    return this.errorMessage || this.changeset.errors;
  }

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
      DeliItemValidations,
    );
    this.changeset = changeset;
  }

  saveItem = dropTask(async () => {
    await this.changeset.validate();

    if (!this.changeset.isValid) {
      return;
    }

    try {
      if (this.image) {
        const generatedFileName = generateFileName(this.image);
        await this.image.upload(`${baseUrl}/upload`, {
          headers: this.uploadHeaders,
          data: { generatedFileName },
        });
        this.changeset.set('imageUrl', generatedFileName);
      }

      await this.changeset.save();
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
      this.changeset.set('imageUrl', url);
    } catch (ex) /* eslint-disable-line no-unused-vars */ {
      this.fileErrorMessage = 'Could not read the file contents';
    }
  });

  @action
  updateHidden() {
    this.changeset.set('isHidden', !this.changeset.get('isHidden'));
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
