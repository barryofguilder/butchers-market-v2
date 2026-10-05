import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { dropTask } from 'ember-concurrency';
import MeatBundleValidations from '../../../validations/meat-bundle';
import FormState from '../../../utils/form-state';
import { getErrorMessageFromException } from '../../../utils/error-handling';

export default class MeatBundleFormComponent extends Component {
  form;

  @tracked prices;
  @tracked items;
  @tracked errorMessage;
  @tracked reordering = false;

  get hasErrors() {
    return this.errorMessage || this.form.isInvalid;
  }

  // The form always keeps one item field on screen, so blank fields have to be dropped before
  // saving. Otherwise an untouched bundle sends `['']`, which the API rejects.
  get filledItems() {
    return this.items.map((item) => item.trim()).filter(Boolean);
  }

  get saveDisabled() {
    return this.form.isInvalid;
  }

  constructor() {
    super(...arguments);

    this.form = new FormState(this.args.bundle, MeatBundleValidations);
    // Copied so editing a field doesn't change the model's array before the form is saved.
    let items = [...this.form.get('items')];

    // Ensure there's always an item field
    if (items.length === 0) {
      items = [''];
    }

    this.items = items;
  }

  saveBundle = dropTask(async () => {
    this.syncItems();

    this.form.validate();

    if (!this.form.isValid) {
      return;
    }

    try {
      await this.form.save();
      this.args.saved();
    } catch (ex) {
      this.errorMessage = await getErrorMessageFromException(ex);
    }
  });

  @action
  updateFeatured() {
    this.form.set('featured', !this.form.get('featured'));
  }

  @action
  updateHidden() {
    this.form.set('isHidden', !this.form.get('isHidden'));
  }

  @action
  updateOrderEnabled() {
    this.form.set('orderEnabled', !this.form.get('orderEnabled'));
  }

  @action
  addItem() {
    this.items = [...this.items, ''];
  }

  @action
  itemChanged(index, value) {
    this.items[index] = value;
    this.syncItems();
  }

  @action
  deleteItem(index) {
    let items = this.items.filter((item, itemIndex) => itemIndex !== index);

    // Ensure there's always an item field
    if (items.length === 0) {
      items = [''];
    }

    this.items = items;
    this.syncItems();
  }

  // The item fields write to `items` instead of the form, so the form needs the new list
  // pushed onto it for its `items` validation to re-run. Without this, a save blocked by
  // the items validation would leave the Save button disabled even after items were added.
  @action
  syncItems() {
    this.form.set('items', this.filledItems);
  }

  @action
  reorderItems(itemModels) {
    this.items = itemModels;
  }
}
