import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import MeatBundleValidations from 'butchers-market/validations/meat-bundle';
import { dropTask } from 'ember-concurrency-decorators';

export default class MeatBundleForm extends Component {
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
      lookupValidator(MeatBundleValidations),
      MeatBundleValidations
    );
    let items = changeset.get('items');

    // Ensure there's always an item field
    if (items.length === 0) {
      items.pushObject('');
    }

    this.changeset = changeset;
    this.items = items;
  }

  @dropTask
  *saveBundle() {
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
  }

  @action
  updateFeatured() {
    this.changeset.set('featured', !this.changeset.get('featured'));
  }

  @action
  updateHidden() {
    this.changeset.set('isHidden', !this.changeset.get('isHidden'));
  }

  @action
  updateOrderEnabled() {
    this.changeset.set('orderEnabled', !this.changeset.get('orderEnabled'));
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
