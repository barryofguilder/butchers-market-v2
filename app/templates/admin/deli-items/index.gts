import { fn } from '@ember/helper';
import type { RouteTemplate } from '../../../utils/route-template';
import type AdminDeliItemsIndexController from '../../../controllers/admin/deli-items/index';
import type DeliItem from '../../../models/deli-item';
import BackLink from '../../../components/admin/back-link';
import DeleteDeliItemForm from '../../../components/admin/deli-items/delete-deli-item-form';
import MiniForm from '../../../components/admin/deli-items/mini-form';
import Title from '../../../components/admin/title';
import UiTable from '../../../components/admin/ui-table';
import UiButton from '../../../components/ui-button';

const AdminDeliItemsIndexTemplate: RouteTemplate<DeliItem[], AdminDeliItemsIndexController> =
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
        @currentSort={{@controller.currentSort}}
        @onColumnClick={{@controller.sortDeliItems}}
        as |Thead|
      >
        <Thead.Th @name="title">Title</Thead.Th>
        <Thead.Th>Is Hidden?</Thead.Th>
        <Thead.Th />
      </Table.Head>
      <Table.Body as |Tbody|>
        {{#each @controller.sortedDeliItems as |item|}}
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
                  @onClick={{fn @controller.openDeleteModal item}}
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
      @isOpen={{@controller.deleteModalOpen}}
      @item={{@controller.itemToDelete}}
      @onSave={{@controller.closeDeleteModal}}
      @onCancel={{@controller.closeDeleteModal}}
    />

    {{outlet}}
  </template>;

export default AdminDeliItemsIndexTemplate;
