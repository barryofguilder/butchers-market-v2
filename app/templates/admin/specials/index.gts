import { fn } from '@ember/helper';
import sortableGroup from 'ember-sortable/modifiers/sortable-group';
import sortableHandle from 'ember-sortable/modifiers/sortable-handle';
import sortableItem from 'ember-sortable/modifiers/sortable-item';
import type { RouteTemplate } from '../../../utils/route-template';
import type AdminSpecialsIndexController from '../../../controllers/admin/specials/index';
import type Special from '../../../models/special';
import dateFormat from '../../../helpers/date-format';
import sortBy from '../../../helpers/sort-by';
import BackLink from '../../../components/admin/back-link';
import DeleteSpecialForm from '../../../components/admin/specials/delete-special-form';
import MiniForm from '../../../components/admin/specials/mini-form';
import Title from '../../../components/admin/title';
import UiTable from '../../../components/admin/ui-table';
import UiAlert from '../../../components/ui-alert';
import UiButton from '../../../components/ui-button';
import UiIcon from '../../../components/ui-icon';

const AdminSpecialsIndexTemplate: RouteTemplate<Special[], AdminSpecialsIndexController> =
  <template>
    <BackLink @route='admin.index' @text='Admin' />

    <Title @title='Specials' />

    <div class='mt-8'>
      <UiButton @route='admin.specials.new' @icon='plus' @size='medium' @variant='plain'>
        New
      </UiButton>
    </div>

    {{#if @controller.showErrorMessage}}
      <UiAlert @variant='danger' class='mt-4'>
        Something went wrong trying to save the ordering of the specials. Please refresh the page
        and try again.
      </UiAlert>
    {{/if}}

    <UiTable class='mt-8' as |Table|>
      <Table.Head as |Thead|>
        <Thead.Th />
        <Thead.Th>Title</Thead.Th>
        <Thead.Th class='hidden md:table-cell'>Active Start Date</Thead.Th>
        <Thead.Th class='hidden md:table-cell'>Active End Date</Thead.Th>
        <Thead.Th>In Stock?</Thead.Th>
        <Thead.Th class='hidden md:table-cell'>Hidden?</Thead.Th>
        <Thead.Th />
      </Table.Head>
      <Table.Body {{sortableGroup onChange=@controller.reorderItems}} as |Tbody|>
        {{#each (sortBy 'displayOrder' @model) as |special|}}
          <Tbody.Tr {{sortableItem model=special}} as |Row|>
            <Row.Td>
              <UiIcon @icon='arrows-alt-v' class='block w-4' {{sortableHandle}} />
            </Row.Td>
            <Row.Td>
              {{special.title}}
            </Row.Td>
            <Row.Td class='hidden md:table-cell'>
              {{#if special.activeStartDate}}
                {{dateFormat special.activeStartDate 'LL/dd/yyyy'}}
              {{/if}}
            </Row.Td>
            <Row.Td class='hidden md:table-cell'>
              {{#if special.activeEndDate}}
                {{dateFormat special.activeEndDate 'LL/dd/yyyy'}}
              {{/if}}
            </Row.Td>
            <Row.Td>
              <MiniForm @special={{special}} />
            </Row.Td>
            <Row.Td class='hidden md:table-cell'>
              {{if special.isHidden 'Yes' 'No'}}
            </Row.Td>
            <Row.Td>
              <div class='flex justify-end'>
                <UiButton
                  @route='admin.specials.edit'
                  @model={{special.id}}
                  @iconOnly={{true}}
                  @icon='pencil-alt'
                  @variant='secondary'
                />

                <UiButton
                  class='ml-1'
                  @iconOnly={{true}}
                  @icon='trash-alt'
                  @variant='danger'
                  @onClick={{fn @controller.openDeleteModal special}}
                />
              </div>
            </Row.Td>
          </Tbody.Tr>
        {{else}}
          <Tbody.Empty>
            No specials found.
          </Tbody.Empty>
        {{/each}}
      </Table.Body>
    </UiTable>

    <DeleteSpecialForm
      @isOpen={{@controller.deleteModalOpen}}
      @special={{@controller.specialToDelete}}
      @onSave={{@controller.closeDeleteModal}}
      @onCancel={{@controller.closeDeleteModal}}
    />

    {{outlet}}
  </template>;

export default AdminSpecialsIndexTemplate;
