import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';
import type AdminDeliItemsIndexController from '../../../controllers/admin/deli-items/index';
import type DeliItem from '../../../models/deli-item';
import BackLink from '../../../components/admin/back-link';
import DeleteDeliItemForm from '../../../components/admin/deli-items/delete-deli-item-form';
import MiniForm from '../../../components/admin/deli-items/mini-form';
import Title from '../../../components/admin/title';
import UiTable, {
  convertToColumnOutput,
  convertToSort,
  type ColumnOutput,
} from '../../../components/admin/ui-table';
import UiButton from '../../../components/ui-button';
import sortBy from '../../../helpers/sort-by';

interface Signature {
  Args: {
    controller: AdminDeliItemsIndexController;
    model: DeliItem[];
  };
}

export default class AdminDeliItemsIndexTemplate extends Component<Signature> {
  @tracked itemToDelete: DeliItem | null = null;
  @tracked deleteModalOpen = false;

  get currentSort() {
    return convertToColumnOutput(this.args.controller.sort);
  }

  get sortedDeliItems() {
    const { sortColumn, sortDirection } = this.currentSort;
    const sortKey = sortColumn ? `${sortColumn}:${sortDirection}` : 'title:asc';

    return sortBy([sortKey], this.args.model);
  }

  sortDeliItems = (sort: ColumnOutput) => {
    this.args.controller.sort = convertToSort(sort);
  };

  openDeleteModal = (item: DeliItem) => {
    this.itemToDelete = item;
    this.deleteModalOpen = true;
  };

  closeDeleteModal = () => {
    this.deleteModalOpen = false;
  };

  <template>
    <BackLink @route="admin.index" @text="Admin" />

    <Title @title="Deli Items" />

    <div class="mt-8">
      <UiButton @route="admin.deli-items.new" @icon="plus" @size="medium" @variant="plain">
        New
      </UiButton>
    </div>

    <UiTable class="mt-8" as |Table|>
      <Table.Head
        @currentSort={{this.currentSort}}
        @onColumnClick={{this.sortDeliItems}}
        as |Thead|
      >
        <Thead.Th @name="title">Title</Thead.Th>
        <Thead.Th>Is Hidden?</Thead.Th>
        <Thead.Th />
      </Table.Head>
      <Table.Body as |Tbody|>
        {{#each this.sortedDeliItems as |item|}}
          <Tbody.Tr as |Row|>
            <Row.Td>{{item.title}}</Row.Td>
            <Row.Td>
              <MiniForm @item={{item}} />
            </Row.Td>
            <Row.Td>
              <div class="flex justify-end">
                <UiButton
                  @route="admin.deli-items.edit"
                  @model={{item.id}}
                  @iconOnly={{true}}
                  @icon="pencil-alt"
                  @variant="secondary"
                />

                <UiButton
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
            No deli items found.
          </Tbody.Empty>
        {{/each}}
      </Table.Body>
    </UiTable>

    <DeleteDeliItemForm
      @isOpen={{this.deleteModalOpen}}
      @item={{this.itemToDelete}}
      @onSave={{this.closeDeleteModal}}
      @onCancel={{this.closeDeleteModal}}
    />

    {{outlet}}
  </template>
}
