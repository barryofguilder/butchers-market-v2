import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { dropTask, enqueueTask } from 'ember-concurrency';
import PackageBundleValidations from '../../../validations/package-bundle';
import FormState from '../../../utils/form-state';
import baseUrl from '../../../utils/base-url';
import { generatePdfFileName } from '../../../utils/file-name';
import { getErrorMessageFromException } from '../../../utils/error-handling';

export default class PackageBundleFormComponent extends Component {
  @service router;
  @service session;

  form;

  @tracked prices;
  @tracked reorderingPrices = false;
  @tracked items;
  @tracked reorderingItems = false;
  @tracked file;
  @tracked tempFileUrl;
  @tracked errorMessage;
  @tracked fileErrorMessage;

  get hasErrors() {
    return this.errorMessage || this.form.isInvalid;
  }

  get hasFile() {
    return this.form.get('fileUrl') || this.tempFileUrl;
  }

  get fileUrl() {
    if (this.tempFileUrl) {
      return this.tempFileUrl;
    }

    return this.form.get('fileUrlPath');
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

    this.form = new FormState(this.args.bundle, PackageBundleValidations);
    // Copied so editing a field doesn't change the model's array before the form is saved.
    let prices = [...this.form.get('prices')];

    // Ensure there's always a price field
    if (prices.length === 0) {
      prices = [''];
    }

    let items = [...this.form.get('items')];

    // Ensure there's always an item field
    if (items.length === 0) {
      items = [''];
    }

    this.prices = prices;
    this.items = items;
  }

  saveBundle = dropTask(async () => {
    this.form.set('prices', this.prices);
    this.form.set('items', this.items);

    this.form.validate();

    if (!this.form.isValid) {
      return;
    }

    try {
      if (this.file) {
        const generatedFileName = generatePdfFileName(this.file);
        await this.file.upload(`${baseUrl}/upload`, {
          headers: this.uploadHeaders,
          data: { generatedFileName },
        });
        this.form.set('fileUrl', generatedFileName);
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

  uploadFileTask = enqueueTask({ maxConcurrency: 3 }, async (file) => {
    try {
      let url = await file.readAsDataURL();
      this.tempFileUrl = url;
      this.file = file;
    } catch (ex) /* eslint-disable-line no-unused-vars */ {
      this.fileErrorMessage = 'Could not read the file contents';
    }
  });

  @action
  uploadFile(file) {
    this.form.set('fileUrl', null);
    this.uploadFileTask.perform(file);
  }

  @action
  removeFile() {
    this.file = null;
    this.tempFileUrl = null;

    this.form.set('fileUrl', null);
  }

  @action
  addPrice() {
    this.prices = [...this.prices, ''];
  }

  @action
  priceChanged(index, value) {
    this.prices[index] = value;
  }

  @action
  deletePrice(index) {
    let prices = this.prices.filter((price, priceIndex) => priceIndex !== index);

    // Ensure there's always a price field
    if (prices.length === 0) {
      prices = [''];
    }

    this.prices = prices;
  }

  @action
  reorderPrices(priceModels) {
    this.prices = priceModels;
  }

  @action
  addItem() {
    this.items = [...this.items, ''];
  }

  @action
  itemChanged(index, value) {
    this.items[index] = value;
  }

  @action
  deleteItem(index) {
    let items = this.items.filter((item, itemIndex) => itemIndex !== index);

    // Ensure there's always an item field
    if (items.length === 0) {
      items = [''];
    }

    this.items = items;
  }

  @action
  reorderItems(itemModels) {
    this.items = itemModels;
  }
}
