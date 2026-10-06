import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { eq } from 'ember-truth-helpers';
import type AdminGrabAndGoIndexController from '../../../controllers/admin/grab-and-go/index';
import type { GrabAndGo } from '../../../schemas/grab-and-go';
import BackLink from '../../../components/admin/back-link';
import DeleteItemForm from '../../../components/admin/grab-and-go/delete-item-form';
import MiniForm from '../../../components/admin/grab-and-go/mini-form';
import Title from '../../../components/admin/title';
import UiTable from '../../../components/admin/ui-table';
import UiBaseLink from '../../../components/ui-base-link';
import UiButton from '../../../components/ui-button';

const STOCK_FILTERS = [
  { value: 'in-stock', label: 'In Stock' },
  { value: 'out-of-stock', label: 'Out of Stock' },
  { value: 'all', label: 'All' },
];

interface Signature {
  Args: {
    controller: AdminGrabAndGoIndexController;
    model: GrabAndGo[];
  };
}

export default class AdminGrabAndGoIndexTemplate extends Component<Signature> {
  stockFilters = STOCK_FILTERS;

  @tracked itemToDelete: GrabAndGo | null = null;
  @tracked deleteModalOpen = false;

  get filteredItems() {
    switch (this.args.controller.stock) {
      case 'in-stock':
        return this.args.model.filter((item) => item.inStock);
      case 'out-of-stock':
        return this.args.model.filter((item) => !item.inStock);
      default:
        return this.args.model;
    }
  }

  get emptyMessage() {
    switch (this.args.controller.stock) {
      case 'in-stock':
        return 'No in stock grab and go items found.';
      case 'out-of-stock':
        return 'No out of stock grab and go items found.';
      default:
        return 'No grab and go items found.';
    }
  }

  setStockFilter = (value: string) => {
    this.args.controller.stock = value;
  };

  openDeleteModal = (item: GrabAndGo) => {
    this.itemToDelete = item;
    this.deleteModalOpen = true;
  };

  closeDeleteModal = () => {
    this.deleteModalOpen = false;
  };

  <template>
    <BackLink @route="admin.index" @text="Admin" />

    <Title @title="Grab and Go" />

    <div class="mt-8 flex flex-wrap justify-between items-center gap-4">
      <UiButton @route="admin.grab-and-go.new" @icon="plus" @size="medium" @variant="plain">
        New
      </UiButton>

      <div class="flex flex-wrap items-center gap-x-12 gap-y-4">
        <UiBaseLink
          @route="admin.grab-and-go.social"
          class="text-red-700 hover:text-red-800 focus:text-red-800"
        >
          Social Titles
        </UiBaseLink>

        <div
          role="group"
          aria-label="Filter by stock"
          data-test-id="stock-filter"
          class="inline-flex rounded-sm border border-gray-300"
        >
          {{#each this.stockFilters as |filter|}}
            <button
              type="button"
              aria-pressed={{if (eq filter.value @controller.stock) "true" "false"}}
              class="px-4 py-2 text-sm font-semibold transition-colors not-first:border-l not-first:border-gray-300 focus:outline-hidden focus:ring-3 focus:ring-blue-500
                {{if
                  (eq filter.value @controller.stock)
                  'bg-gray-800 text-white'
                  'bg-transparent hover:bg-gray-300'
                }}"
              {{on "click" (fn this.setStockFilter filter.value)}}
            >
              {{filter.label}}
            </button>
          {{/each}}
        </div>
      </div>
    </div>

    <UiTable class="mt-8" as |Table|>
      <Table.Head as |Thead|>
        <Thead.Th>Title</Thead.Th>
        <Thead.Th>In Stock?</Thead.Th>
        <Thead.Th>Is Holiday?</Thead.Th>
        <Thead.Th />
      </Table.Head>
      <Table.Body as |Tbody|>
        {{#each this.filteredItems as |item|}}
          <Tbody.Tr data-test-id="grab-and-go" as |Row|>
            <Row.Td>
              {{item.title}}
            </Row.Td>
            <Row.Td>
              <MiniForm @item={{item}} @field="inStock" />
            </Row.Td>
            <Row.Td>
              <MiniForm @item={{item}} @field="isHoliday" />
            </Row.Td>
            <Row.Td>
              <div class="flex justify-end">
                <UiButton
                  data-test-id="edit"
                  @route="admin.grab-and-go.edit"
                  @model={{item.id}}
                  @iconOnly={{true}}
                  @icon="pencil-alt"
                  @variant="secondary"
                />

                <UiButton
                  data-test-id="delete"
                  class="ml-1"
                  @iconOnly={{true}}
                  @icon="trash-alt"
                  @variant="danger"
                  @onClick={{fn this.openDeleteModal item}}
                />
              </div>
            </Row.Td>
          </Tbody.Tr>
        {{else}}
          <Tbody.Empty>
            {{this.emptyMessage}}
          </Tbody.Empty>
        {{/each}}
      </Table.Body>
    </UiTable>

    <DeleteItemForm
      @isOpen={{this.deleteModalOpen}}
      @item={{this.itemToDelete}}
      @onSave={{this.closeDeleteModal}}
      @onCancel={{this.closeDeleteModal}}
    />

    {{outlet}}
  </template>
}
