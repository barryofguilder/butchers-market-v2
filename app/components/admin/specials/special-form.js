import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { dropTask, enqueueTask } from 'ember-concurrency';
import SpecialValidations from '../../../validations/special';
import FormState from '../../../utils/form-state';
import baseUrl from '../../../utils/base-url';
import { generateFileName } from '../../../utils/file-name';
import { getErrorMessageFromException } from '../../../utils/error-handling';
import { ORDER_ONLINE_URL } from '../../../utils/config';

export default class SpecialFormComponent extends Component {
  @service router;
  @service session;

  form;
  orderOnlineUrl = ORDER_ONLINE_URL;

  @tracked activeDuringRange = false;
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

  constructor() {
    super(...arguments);

    this.form = new FormState(this.args.special, SpecialValidations);

    if (this.form.get('activeStartDate')) {
      this.activeDuringRange = true;
    }
  }

  saveSpecial = dropTask(async () => {
    this.form.validate();

    const hasImage = this.image || this.form.get('imageUrl');

    if (!this.form.isValid || !hasImage) {
      if (!hasImage) {
        this.form.addError('image', 'Image URL is required');
      }

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
      this.form.removeError('image');
    } catch (ex) /* eslint-disable-line no-unused-vars */ {
      this.fileErrorMessage = 'Could not read the file contents';
    }
  });

  @action
  uploadImage(file) {
    this.form.set('imageUrl', null);
    this.uploadPhoto.perform(file);
  }

  @action
  removeImage() {
    this.image = null;
    this.tempImageUrl = null;
    this.form.removeError('image');

    this.form.set('imageUrl', null);
  }

  @action
  toggleActiveDuringRange(checked) {
    this.activeDuringRange = checked;

    if (this.activeDuringRange === false) {
      this.form.set('activeStartDate', null);
      this.form.set('activeEndDate', null);
    }
  }

  @action
  startDateSelected(date) {
    this.form.set(
      'activeStartDate',
      new Date(date[0].getFullYear(), date[0].getMonth(), date[0].getDate(), 0, 0, 0)
    );
  }

  @action
  endDateSelected(date) {
    this.form.set(
      'activeEndDate',
      new Date(date[0].getFullYear(), date[0].getMonth(), date[0].getDate(), 23, 59, 59)
    );
  }

  @action
  updateInStock() {
    this.form.set('inStock', !this.form.get('inStock'));
  }

  @action
  updateIsHidden() {
    this.form.set('isHidden', !this.form.get('isHidden'));
  }
}
