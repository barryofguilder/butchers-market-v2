import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';
import type Owner from '@ember/owner';
import { dropTask } from 'ember-concurrency';
import set from 'ember-set-helper/helpers/set';
import sortableGroup from 'ember-sortable/modifiers/sortable-group';
import sortableHandle from 'ember-sortable/modifiers/sortable-handle';
import sortableItem from 'ember-sortable/modifiers/sortable-item';
import type MeatBundle from '../../../models/meat-bundle';
import MeatBundleValidations from '../../../validations/meat-bundle';
import FormState from '../../../utils/form-state';
import { getErrorMessageFromException } from '../../../utils/error-handling';
import UiAlert from '../../ui-alert';
import UiButton from '../../ui-button';
import UiIcon from '../../ui-icon';
import UiTextbox from '../../ui-textbox';
import AdminForm from '../admin-form';
import Required from '../required';

interface MeatBundleFormSignature {
  Args: {
    bundle: MeatBundle;
    cancelled: () => void;
    saved: () => void;
  };
}

export default class MeatBundleFormComponent extends Component<MeatBundleFormSignature> {
  form: FormState<MeatBundle>;

  @tracked items: string[];
  @tracked errorMessage: string | null = null;
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

  constructor(owner: Owner, args: MeatBundleFormSignature['Args']) {
    super(owner, args);

    this.form = new FormState(this.args.bundle, MeatBundleValidations);
    // Copied so editing a field doesn't change the model's array before the form is saved.
    let items = [...(this.form.get('items') ?? [])];

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

  updateFeatured = () => {
    this.form.set('featured', !this.form.get('featured'));
  };

  updateHidden = () => {
    this.form.set('isHidden', !this.form.get('isHidden'));
  };

  updateOrderEnabled = () => {
    this.form.set('orderEnabled', !this.form.get('orderEnabled'));
  };

  addItem = () => {
    this.items = [...this.items, ''];
  };

  itemChanged = (index: number, value: string) => {
    this.items[index] = value;
    this.syncItems();
  };

  deleteItem = (index: number) => {
    let items = this.items.filter((_item, itemIndex) => itemIndex !== index);

    // Ensure there's always an item field
    if (items.length === 0) {
      items = [''];
    }

    this.items = items;
    this.syncItems();
  };

  // The item fields write to `items` instead of the form, so the form needs the new list
  // pushed onto it for its `items` validation to re-run. Without this, a save blocked by
  // the items validation would leave the Save button disabled even after items were added.
  syncItems = () => {
    this.form.set('items', this.filledItems);
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

      <Form.group data-test-id="price" @model={{this.form}} @property="price" as |Group|>
        <Group.label>Price <Required /></Group.label>
        <Group.textbox @value={{this.form.values.price}} @onChange={{this.form.setter "price"}} />
      </Form.group>

      <Form.group data-test-id="featured" @model={{this.form}} @property="featured" as |Group|>
        <Group.checkbox @checked={{this.form.values.featured}} @onChange={{this.updateFeatured}}>
          Is featured on home page?
        </Group.checkbox>
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

      <Form.group data-test-id="hidden" @model={{this.form}} @property="isHidden" as |Group|>
        <Group.checkbox @checked={{this.form.values.isHidden}} @onChange={{this.updateHidden}}>
          Is Hidden?
        </Group.checkbox>
        <Group.help>
          When checked, this means it won't show on your site. Useful when a pandemic is occuring
          and you run out of meat.
        </Group.help>
      </Form.group>

      <Form.group data-test-id="order" @model={{this.form}} @property="orderEnabled" as |Group|>
        <Group.checkbox
          @checked={{this.form.values.orderEnabled}}
          @onChange={{this.updateOrderEnabled}}
        >
          Can order online?
        </Group.checkbox>
        <Group.help>
          When checked, this means the "Order Now" button is displayed to take them to the online
          store.
        </Group.help>
      </Form.group>

      <Form.group data-test-id="items" @model={{this.form}} @property="items" as |Group|>
        <Form.label>
          Items
          <Required />
        </Form.label>

        <Group.validationErrors class="mb-1" />

        {{#if this.reordering}}
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
            <UiButton @size="medium" @variant="plain" @onClick={{set this "reordering" false}}>
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
              @onClick={{set this "reordering" true}}
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
