import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';
import type Owner from '@ember/owner';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import { dropTask } from 'ember-concurrency';
import set from 'ember-set-helper/helpers/set';
import sortableGroup from 'ember-sortable/modifiers/sortable-group';
import sortableHandle from 'ember-sortable/modifiers/sortable-handle';
import sortableItem from 'ember-sortable/modifiers/sortable-item';
import type { PackageBundle } from '../../../schemas/package-bundle';
import type SessionService from '../../../services/session';
import type Store from '../../../services/store';
import PackageBundleValidations from '../../../validations/package-bundle';
import FormState from '../../../utils/form-state';
import { PdfUpload } from '../../../utils/file-upload';
import { saveRecord } from '../../../utils/records';
import { getErrorMessageFromException, isUnauthorized } from '../../../utils/error-handling';
import UiAlert from '../../ui-alert';
import UiButton from '../../ui-button';
import UiIcon from '../../ui-icon';
import UiTextbox from '../../ui-textbox';
import AdminForm from '../admin-form';
import Required from '../required';

interface PackageBundleFormSignature {
  Args: {
    bundle: PackageBundle;
    cancelled: () => void;
    saved: () => void;
  };
}

export default class PackageBundleFormComponent extends Component<PackageBundleFormSignature> {
  @service declare router: RouterService;
  @service declare session: SessionService;
  @service declare store: Store;

  form: FormState<PackageBundle>;
  pdf: PdfUpload<PackageBundle>;

  @tracked prices: string[];
  @tracked reorderingPrices = false;
  @tracked items: string[];
  @tracked reorderingItems = false;
  @tracked errorMessage: string | null = null;

  get hasErrors() {
    return this.errorMessage || this.pdf.errorMessage || this.form.isInvalid;
  }

  get saveDisabled() {
    return this.form.isInvalid;
  }

  constructor(owner: Owner, args: PackageBundleFormSignature['Args']) {
    super(owner, args);

    this.form = new FormState(this.args.bundle, PackageBundleValidations, (bundle) =>
      saveRecord(this.store, bundle)
    );
    this.pdf = new PdfUpload(this, this.form);
    // Copied so editing a field doesn't change the model's array before the form is saved.
    let prices = [...(this.form.get('prices') ?? [])];

    // Ensure there's always a price field
    if (prices.length === 0) {
      prices = [''];
    }

    let items = [...(this.form.get('items') ?? [])];

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

    this.errorMessage = null;

    try {
      if (!(await this.pdf.upload())) {
        return;
      }

      await this.form.submit();
      this.args.saved();
    } catch (ex) {
      if (isUnauthorized(ex)) {
        return this.session.redirectToSignIn(this.router.currentURL ?? '');
      } else {
        this.errorMessage = await getErrorMessageFromException(ex);
      }
    }
  });

  addPrice = () => {
    this.prices = [...this.prices, ''];
  };

  priceChanged = (index: number, value: string) => {
    this.prices[index] = value;
  };

  deletePrice = (index: number) => {
    let prices = this.prices.filter((_price, priceIndex) => priceIndex !== index);

    // Ensure there's always a price field
    if (prices.length === 0) {
      prices = [''];
    }

    this.prices = prices;
  };

  reorderPrices = (priceModels: string[]) => {
    this.prices = priceModels;
  };

  addItem = () => {
    this.items = [...this.items, ''];
  };

  itemChanged = (index: number, value: string) => {
    this.items[index] = value;
  };

  deleteItem = (index: number) => {
    let items = this.items.filter((_item, itemIndex) => itemIndex !== index);

    // Ensure there's always an item field
    if (items.length === 0) {
      items = [''];
    }

    this.items = items;
  };

  reorderItems = (itemModels: string[]) => {
    this.items = itemModels;
  };

  <template>
    <AdminForm class="max-w-xl" @onSubmit={{this.saveBundle.perform}} as |Form|>
      {{#if this.errorMessage}}
        <UiAlert data-test-id="server-error" @variant="danger">
          {{this.errorMessage}}
        </UiAlert>
      {{/if}}

      <p class="mb-8">
        <strong>Note:</strong>
        Required fields are marked with an
        <Required />
      </p>

      <Form.group data-test-id="title" @model={{this.form}} @property="title" as |Group|>
        <Group.label>
          Title
          <Required />
        </Group.label>
        <Group.textbox @value={{this.form.values.title}} @onChange={{this.form.setter "title"}} />
      </Form.group>

      <Form.group data-test-id="file" @model={{this.form}} @property="fileUrl" as |Group|>
        <Group.label>PDF File</Group.label>
        <Group.pdf @pdf={{this.pdf}} @title="Package Bundle PDF" />
      </Form.group>

      <Form.group data-test-id="prices">
        <Form.label>Prices</Form.label>

        {{#if this.reorderingPrices}}
          <div {{sortableGroup onChange=this.reorderPrices}}>
            {{#each this.prices as |price index|}}
              <div data-test-id="item-{{index}}" class="py-3" {{sortableItem model=price}}>
                <div class="flex gap-2 items-center">
                  <UiIcon @icon="arrows-alt-v" class="block text-center w-6" {{sortableHandle}} />
                  <p>{{price}}</p>
                </div>
              </div>
            {{/each}}
          </div>

          <div class="mt-2">
            <UiButton
              @size="medium"
              @variant="plain"
              @onClick={{set this "reorderingPrices" false}}
            >
              Done
            </UiButton>
          </div>
        {{else}}
          {{#each this.prices as |price index|}}
            <div data-test-id="item-{{index}}" class="py-1">
              <div class="flex items-center">
                <UiTextbox @value={{price}} @onChange={{fn this.priceChanged index}} />
                <UiButton
                  class="mr-1"
                  @iconOnly={{true}}
                  @icon="trash-alt"
                  @variant="danger"
                  title="Delete price"
                  @onClick={{fn this.deletePrice index}}
                />
              </div>
            </div>
          {{/each}}

          <div class="mt-2 flex gap-2">
            <UiButton @icon="plus" @size="medium" @variant="plain" @onClick={{this.addPrice}}>
              New Price
            </UiButton>

            <UiButton
              @icon="arrows-alt-v"
              @size="medium"
              @variant="plain"
              @onClick={{set this "reorderingPrices" true}}
            >
              Re-order Prices
            </UiButton>
          </div>
        {{/if}}
      </Form.group>

      <Form.group data-test-id="sale" @model={{this.form}} @property="sale" as |Group|>
        <Group.label>Special Text</Group.label>
        <Group.textbox
          @value={{this.form.values.specialText}}
          @onChange={{this.form.setter "specialText"}}
        />
        <small class="block mt-3 text-gray-700">
          Will show under the title in a red text.
        </small>
      </Form.group>

      <Form.group data-test-id="items">
        <Form.label>Items</Form.label>

        {{#if this.reorderingItems}}
          <div {{sortableGroup onChange=this.reorderItems}}>
            {{#each this.items as |item index|}}
              <div data-test-id="item-{{index}}" class="py-3" {{sortableItem model=item}}>
                <div class="flex gap-2 items-center">
                  <UiIcon @icon="arrows-alt-v" class="block text-center w-6" {{sortableHandle}} />
                  <p>{{item}}</p>
                </div>
              </div>
            {{/each}}
          </div>

          <div class="mt-2">
            <UiButton @size="medium" @variant="plain" @onClick={{set this "reorderingItems" false}}>
              Done
            </UiButton>
          </div>
        {{else}}
          {{#each this.items as |item index|}}
            <div data-test-id="item-{{index}}" class="py-1">
              <div class="flex items-center">
                <UiTextbox @value={{item}} @onChange={{fn this.itemChanged index}} />
                <UiButton
                  class="mr-1"
                  @iconOnly={{true}}
                  @icon="trash-alt"
                  @variant="danger"
                  title="Delete item"
                  @onClick={{fn this.deleteItem index}}
                />
              </div>
            </div>
          {{/each}}

          <div class="mt-2 flex gap-2">
            <UiButton @icon="plus" @size="medium" @variant="plain" @onClick={{this.addItem}}>
              New Item
            </UiButton>

            <UiButton
              @icon="arrows-alt-v"
              @size="medium"
              @variant="plain"
              @onClick={{set this "reorderingItems" true}}
            >
              Re-order Items
            </UiButton>
          </div>
        {{/if}}
      </Form.group>

      <div class="mt-8">
        {{#if this.hasErrors}}
          <div class="mb-2 text-red-600">
            There are errors in the form above.
          </div>
        {{/if}}
        <Form.submit @disabled={{this.saveDisabled}}>
          Save
        </Form.submit>
        <UiButton class="ml-2" @variant="plain" @onClick={{@cancelled}}>Cancel</UiButton>
      </div>
    </AdminForm>
  </template>
}
