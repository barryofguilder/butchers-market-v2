import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type Store from '../../../services/store';
import { dropTask } from 'ember-concurrency';
import { reorderSpecials } from '../../../builders/special';
import { fn } from '@ember/helper';
import sortableGroup from 'ember-sortable/modifiers/sortable-group';
import sortableHandle from 'ember-sortable/modifiers/sortable-handle';
import sortableItem from 'ember-sortable/modifiers/sortable-item';
import type { Special } from '../../../schemas/special';
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

interface Signature {
  Args: {
    model: Special[];
  };
}

export default class AdminSpecialsIndexTemplate extends Component<Signature> {
  @service declare store: Store;

  @tracked showErrorMessage = false;
  @tracked specialToDelete: Special | null = null;
  @tracked deleteModalOpen = false;

  reorderItems = (specials: Special[]) => {
    this.saveSpecialOrdering.perform(specials);
  };

  saveSpecialOrdering = dropTask(async (specials: Special[]) => {
    this.showErrorMessage = false;

    try {
      // The table sorts on `displayOrder`, so setting it here is what moves the row.
      specials.forEach((special, index) => {
        special.displayOrder = index + 1;
      });

      // The response has every special with its new `displayOrder`. The store applies it, which
      // also clears the changes made above so the records aren't left with unsaved changes.
      await this.store.request(reorderSpecials(specials));
    } catch (ex) {
      this.showErrorMessage = true;
      console.error(ex);
    }
  });

  openDeleteModal = (special: Special) => {
    this.specialToDelete = special;
    this.deleteModalOpen = true;
  };

  closeDeleteModal = () => {
    this.deleteModalOpen = false;
  };

  <template>
    <BackLink @route="admin.index" @text="Admin" />

    <Title @title="Specials" />

    <div class="mt-8">
      <UiButton @route="admin.specials.new" @icon="plus" @size="medium" @variant="plain">
        New
      </UiButton>
    </div>

    {{#if this.showErrorMessage}}
      <UiAlert @variant="danger" class="mt-4">
        Something went wrong trying to save the ordering of the specials. Please refresh the page
        and try again.
      </UiAlert>
    {{/if}}

    <UiTable class="mt-8" as |Table|>
      <Table.Head as |Thead|>
        <Thead.Th />
        <Thead.Th>Title</Thead.Th>
        <Thead.Th class="hidden md:table-cell">Active Start Date</Thead.Th>
        <Thead.Th class="hidden md:table-cell">Active End Date</Thead.Th>
        <Thead.Th>In Stock?</Thead.Th>
        <Thead.Th class="hidden md:table-cell">Hidden?</Thead.Th>
        <Thead.Th />
      </Table.Head>
      <Table.Body {{sortableGroup onChange=this.reorderItems}} as |Tbody|>
        {{#each (sortBy "displayOrder" @model) as |special|}}
          <Tbody.Tr data-test-id="special" {{sortableItem model=special}} as |Row|>
            <Row.Td>
              <UiIcon
                data-test-id="handle"
                @icon="arrows-alt-v"
                class="block w-4"
                {{sortableHandle}}
              />
            </Row.Td>
            <Row.Td>
              {{special.title}}
            </Row.Td>
            <Row.Td class="hidden md:table-cell">
              {{#if special.activeStartDate}}
                {{dateFormat special.activeStartDate "LL/dd/yyyy"}}
              {{/if}}
            </Row.Td>
            <Row.Td class="hidden md:table-cell">
              {{#if special.activeEndDate}}
                {{dateFormat special.activeEndDate "LL/dd/yyyy"}}
              {{/if}}
            </Row.Td>
            <Row.Td>
              <MiniForm @special={{special}} />
            </Row.Td>
            <Row.Td class="hidden md:table-cell">
              {{if special.isHidden "Yes" "No"}}
            </Row.Td>
            <Row.Td>
              <div class="flex justify-end">
                <UiButton
                  data-test-id="edit"
                  @route="admin.specials.edit"
                  @model={{special.id}}
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
                  @onClick={{fn this.openDeleteModal special}}
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
      @isOpen={{this.deleteModalOpen}}
      @special={{this.specialToDelete}}
      @onSave={{this.closeDeleteModal}}
      @onCancel={{this.closeDeleteModal}}
    />

    {{outlet}}
  </template>
}
