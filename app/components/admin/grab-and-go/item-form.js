import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { dropTask, enqueueTask } from 'ember-concurrency';
import ItemValidations from '../../../validations/grab-and-go';
import baseUrl from '../../../utils/base-url';
import { generateFileName } from '../../../utils/file-name';
import { getErrorMessageFromException } from '../../../utils/error-handling';

export default class ItemFormComponent extends Component {
  @service router;
  @service session;

  changeset;

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
      lookupValidator(ItemValidations),
      ItemValidations,
    );

    this.changeset = changeset;
  }

  saveItem = dropTask(async () => {
    await this.changeset.validate();

    try {
      if (this.changeset.image) {
        const generatedFileName = generateFileName(this.changeset.image);
        await this.changeset.image.upload(`${baseUrl}/upload`, {
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
      this.changeset.set('image', file);
    } catch (e) {
      this.fileErrorMessage = 'Could not read the file contents';
    }
  });

  @action
  uploadImage(file) {
    this.changeset.set('imageUrl', null);
    this.uploadPhoto.perform(file);
  }

  @action
  removeImage() {
    this.changeset.set('image', null);
    this.tempImageUrl = null;

    this.changeset.set('imageUrl', null);
  }

  @action
  updateIsFeatured() {
    this.changeset.set('featured', !this.changeset.get('featured'));
  }

  @action
  updateIsSoldOut() {
    this.changeset.set('isSoldOut', !this.changeset.get('isSoldOut'));
  }
}
