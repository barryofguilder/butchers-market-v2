import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import PackageBundleValidations from 'butchers-market/validations/package-bundle';
import { task } from 'ember-concurrency';

export default class PackageBundleForm extends Component {
  changeset;

  @tracked prices;
  @tracked items;
  @tracked errorMessage;

  get saveDisabled() {
    return this.changeset && this.changeset.isInvalid;
  }

  constructor() {
    super(...arguments);

    let changeset = new Changeset(
      this.args.bundle,
      lookupValidator(PackageBundleValidations),
      PackageBundleValidations
    );
    let prices = changeset.get('prices');

    // Ensure there's always a price field
    if (prices.length === 0) {
      prices.pushObject('');
    }

    let items = changeset.get('items');

    // Ensure there's always an item field
    if (items.length === 0) {
      items.pushObject('');
    }

    this.changeset = changeset;
    this.prices = prices;
    this.items = items;
  }

  @(task(function* () {
    this.changeset.set('prices', this.prices);
    this.changeset.set('items', this.items);

    yield this.changeset.validate();

    if (!this.changeset.isValid) {
      return;
    }

    try {
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
  saveBundle;

  @action
  addPrice() {
    this.prices.pushObject('');
  }

  @action
  priceChanged(index, event) {
    this.prices[index] = event.target.value;
  }

  @action
  deletePrice(index) {
    let prices = this.prices.filter((price, priceIndex) => priceIndex !== index);

    // Ensure there's always a price field
    if (prices.length === 0) {
      prices.pushObject('');
    }

    this.prices = prices;
  }

  @action
  reorderPrices({ sourceIndex, sourceList, targetIndex, targetList }) {
    if (sourceIndex === targetIndex) {
      // Not moving up or down
      return;
    }

    const item = sourceList.objectAt(sourceIndex);

    sourceList.removeAt(sourceIndex);
    targetList.insertAt(targetIndex, item);
  }

  @action
  addItem() {
    this.items.pushObject('');
  }

  @action
  itemChanged(index, event) {
    this.items[index] = event.target.value;
  }

  @action
  deleteItem(index) {
    let items = this.items.filter((item, itemIndex) => itemIndex !== index);

    // Ensure there's always an item field
    if (items.length === 0) {
      items.pushObject('');
    }

    this.items = items;
  }

  @action
  reorderItems({ sourceIndex, sourceList, targetIndex, targetList }) {
    if (sourceIndex === targetIndex) {
      // Not moving up or down
      return;
    }

    const item = sourceList.objectAt(sourceIndex);

    sourceList.removeAt(sourceIndex);
    targetList.insertAt(targetIndex, item);
  }
}
