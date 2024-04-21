import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { dropTask, enqueueTask } from 'ember-concurrency';
import PackageBundleValidations from '../../../validations/package-bundle';
import baseUrl from '../../../utils/base-url';
import { generatePdfFileName } from '../../../utils/file-name';

export default class PackageBundleFormComponent extends Component {
  @service router;
  @service session;

  changeset;

  @tracked prices;
  @tracked reorderingPrices = false;
  @tracked items;
  @tracked reorderingItems = false;
  @tracked file;
  @tracked tempFileUrl;
  @tracked errorMessage;
  @tracked fileErrorMessage;

  get hasFile() {
    return this.changeset.get('fileUrl') || this.tempFileUrl;
  }

  get fileUrl() {
    if (this.tempFileUrl) {
      return this.tempFileUrl;
    }

    return this.changeset.get('fileUrlPath');
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
      this.args.bundle,
      lookupValidator(PackageBundleValidations),
      PackageBundleValidations,
    );
    let prices = changeset.get('prices');

    // Ensure there's always a price field
    if (prices.length === 0) {
      prices = [''];
    }

    let items = changeset.get('items');

    // Ensure there's always an item field
    if (items.length === 0) {
      items = [''];
    }

    this.changeset = changeset;
    this.prices = prices;
    this.items = items;
  }

  saveBundle = dropTask(async () => {
    this.changeset.set('prices', this.prices);
    this.changeset.set('items', this.items);

    await this.changeset.validate();

    if (!this.changeset.isValid) {
      return;
    }

    try {
      if (this.file) {
        const generatedFileName = generatePdfFileName(this.file);
        await this.file.upload(`${baseUrl}/upload`, {
          headers: this.uploadHeaders,
          data: { generatedFileName },
        });
        this.changeset.set('fileUrl', generatedFileName);
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

  uploadFileTask = enqueueTask({ maxConcurrency: 3 }, async (file) => {
    try {
      let url = await file.readAsDataURL();
      this.tempFileUrl = url;
      this.file = file;
    } catch (e) {
      this.fileErrorMessage = 'Could not read the file contents';
    }
  });

  @action
  uploadFile(file) {
    this.changeset.set('fileUrl', null);
    this.uploadFileTask.perform(file);
  }

  @action
  removeFile() {
    this.file = null;
    this.tempFileUrl = null;

    this.changeset.set('fileUrl', null);
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
