import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import SpecialValidations from 'butchers-market/validations/special';
import { dropTask, enqueueTask } from 'ember-concurrency';
import baseUrl from 'butchers-market/utils/base-url';
import config from 'butchers-market/config/environment';
import { generateFileName } from 'butchers-market/utils/file-name';

export default class SpecialFormComponent extends Component {
  @service router;
  @service session;

  changeset;
  orderOnlineUrl = config.orderOnlineUrl;

  @tracked activeDuringRange = false;
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
      this.args.special,
      lookupValidator(SpecialValidations),
      SpecialValidations
    );

    this.changeset = changeset;

    if (this.changeset.activeStartDate) {
      this.activeDuringRange = true;
    }
  }

  saveSpecial = dropTask(async () => {
    await this.changeset.validate();

    const hasImage = this.changeset.image || this.changeset.imageUrl;

    if (!this.changeset.isValid || !hasImage) {
      if (!hasImage) {
        this.changeset.addError('image', 'Image URL is required');
      }

      return;
    }

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
      } else if (ex.body) {
        this.errorMessage = ex.body.error;
      } else {
        this.errorMessage = ex;
      }
    }
  });

  uploadPhoto = enqueueTask({ maxConcurrency: 3 }, async file => {
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
  toggleActiveDuringRange(event) {
    this.activeDuringRange = event.target.checked;

    if (this.activeDuringRange === false) {
      this.changeset.set('activeStartDate', null);
      this.changeset.set('activeEndDate', null);
    }
  }

  @action
  startDateSelected(date) {
    this.changeset.set(
      'activeStartDate',
      new Date(date[0].getFullYear(), date[0].getMonth(), date[0].getDate(), 0, 0, 0)
    );
  }

  @action
  endDateSelected(date) {
    this.changeset.set(
      'activeEndDate',
      new Date(date[0].getFullYear(), date[0].getMonth(), date[0].getDate(), 23, 59, 59)
    );
  }

  @action
  updateIsSoldOut() {
    this.changeset.set('isSoldOut', !this.changeset.get('isSoldOut'));
  }

  @action
  updateIsHidden() {
    this.changeset.set('isHidden', !this.changeset.get('isHidden'));
  }
}
