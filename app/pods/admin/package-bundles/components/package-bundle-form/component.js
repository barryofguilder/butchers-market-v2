import Component from '@ember/component';
import { computed } from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import PackageBundleValidations from 'butchers-market/validations/package-bundle';
import { task } from 'ember-concurrency';

export default Component.extend({
  bundle: null,
  saved() {},
  cancelled() {},

  changeset: null,
  prices: null,
  items: null,

  errorMessage: null,
  saveDisabled: computed('changeset.isInvalid', function() {
    return this.get('changeset.isInvalid');
  }),

  init() {
    this._super(...arguments);

    let changeset = new Changeset(
      this.bundle,
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

    this.setProperties({
      changeset,
      prices,
      items,
    });
  },

  saveBundle: task(function*() {
    this.changeset.set('prices', this.prices);
    this.changeset.set('items', this.items);

    yield this.changeset.validate();

    if (!this.changeset.get('isValid')) {
      return;
    }

    try {
      yield this.changeset.save();
      this.saved();
    } catch (ex) {
      if (ex.body) {
        this.set('errorMessage', ex.body.error);
      } else {
        this.set('errorMessage', ex);
      }
    }
  }).drop(),

  actions: {
    addPrice() {
      this.prices.pushObject('');
    },

    priceChanged(index, event) {
      this.prices[index] = event.target.value;
    },

    deletePrice(index) {
      let prices = this.prices.filter((price, priceIndex) => priceIndex !== index);

      // Ensure there's always a price field
      if (prices.length === 0) {
        prices.pushObject('');
      }

      this.set('prices', prices);
    },

    addItem() {
      this.items.pushObject('');
    },

    itemChanged(index, event) {
      this.items[index] = event.target.value;
    },

    deleteItem(index) {
      let items = this.items.filter((item, itemIndex) => itemIndex !== index);

      // Ensure there's always an item field
      if (items.length === 0) {
        items.pushObject('');
      }

      this.set('items', items);
    },
  },
});
