import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type Store from '../../../services/store';
import { dropTask } from 'ember-concurrency';
import type MeatBundleAdapter from '../../../adapters/meat-bundle';
import { fn } from '@ember/helper';
import sortableGroup from 'ember-sortable/modifiers/sortable-group';
import sortableHandle from 'ember-sortable/modifiers/sortable-handle';
import sortableItem from 'ember-sortable/modifiers/sortable-item';
import type MeatBundle from '../../../models/meat-bundle';
import sortBy from '../../../helpers/sort-by';
import BackLink from '../../../components/admin/back-link';
import DeleteMeatBundleForm from '../../../components/admin/meat-bundles/delete-meat-bundle-form';
import Title from '../../../components/admin/title';
import UiTable from '../../../components/admin/ui-table';
import UiAlert from '../../../components/ui-alert';
import UiButton from '../../../components/ui-button';
import UiIcon from '../../../components/ui-icon';

interface Signature {
  Args: {
    model: MeatBundle[];
  };
}

export default class AdminMeatBundlesIndexTemplate extends Component<Signature> {
  @service declare store: Store;

  @tracked showErrorMessage = false;
  @tracked bundleToDelete: MeatBundle | null = null;
  @tracked deleteModalOpen = false;

  reorderItems = (bundles: MeatBundle[]) => {
    this.saveBundleOrdering.perform(bundles);
  };

  saveBundleOrdering = dropTask(async (bundles: MeatBundle[]) => {
    this.showErrorMessage = false;

    try {
      // The table sorts on `displayOrder`, so setting it here is what moves the row.
      bundles.forEach((bundle, index) => {
        bundle.displayOrder = index + 1;
      });

      const adapter = this.store.adapterFor('meat-bundle') as MeatBundleAdapter;
      const response = await adapter.reorderMeatBundles(bundles);

      if (!response.ok) {
        this.showErrorMessage = true;
      }
    } catch (ex) {
      this.showErrorMessage = true;
      console.error(ex);
    }
  });

  openDeleteModal = (bundle: MeatBundle) => {
    this.bundleToDelete = bundle;
    this.deleteModalOpen = true;
  };

  closeDeleteModal = () => {
    this.deleteModalOpen = false;
  };

  <template>
    <BackLink @route="admin.index" @text="Admin" />

    <Title @title="Meat Bundles" />

    <div class="mt-8">
      <UiButton @route="admin.meat-bundles.new" @icon="plus" @size="medium" @variant="plain">
        New
      </UiButton>
    </div>

    {{#if this.showErrorMessage}}
      <UiAlert @variant="danger" class="mt-4">
        Something went wrong trying to save the ordering of the meat bundles. Please refresh the
        page and try again.
      </UiAlert>
    {{/if}}

    <UiTable class="mt-8" as |Table|>
      <Table.Head as |Thead|>
        <Thead.Th />
        <Thead.Th>Title</Thead.Th>
        <Thead.Th class="hidden md:table-cell">Price</Thead.Th>
        <Thead.Th class="hidden md:table-cell">Items</Thead.Th>
        <Thead.Th>Is Featured?</Thead.Th>
        <Thead.Th class="hidden lg:table-cell">Special Text</Thead.Th>
        <Thead.Th class="hidden md:table-cell">Is Hidden?</Thead.Th>
        <Thead.Th />
      </Table.Head>
      <Table.Body {{sortableGroup onChange=this.reorderItems}} as |Tbody|>
        {{#each (sortBy "displayOrder" @model) as |bundle|}}
          <Tbody.Tr {{sortableItem model=bundle}} as |Row|>
            <Row.Td>
              <UiIcon @icon="arrows-alt-v" class="block w-4" {{sortableHandle}} />
            </Row.Td>
            <Row.Td>{{bundle.title}}</Row.Td>
            <Row.Td class="hidden md:table-cell">{{bundle.price}}</Row.Td>
            <Row.Td class="hidden md:table-cell">
              {{#if bundle.items}}
                {{bundle.items.length}}
                Items
              {{else}}
                0 Items
              {{/if}}
            </Row.Td>
            <Row.Td>
              {{#if bundle.featured}}
                <span class="inline-block px-2 bg-blue-200 text-blue-800 text-sm rounded-sm">
                  Featured
                </span>
              {{/if}}
            </Row.Td>
            <Row.Td class="hidden lg:table-cell">{{bundle.specialText}}</Row.Td>
            <Row.Td class="hidden md:table-cell">
              {{#if bundle.isHidden}}
                <span class="inline-block px-2 bg-blue-200 text-blue-800 text-sm rounded-sm">
                  Hidden
                </span>
              {{/if}}
            </Row.Td>
            <Row.Td>
              <div class="flex justify-end">
                <UiButton
                  @route="admin.meat-bundles.edit"
                  @model={{bundle.id}}
                  @iconOnly={{true}}
                  @icon="pencil-alt"
                  @variant="secondary"
                />

                <UiButton
                  class="ml-1"
                  @iconOnly={{true}}
                  @icon="trash-alt"
                  @variant="danger"
                  @onClick={{fn this.openDeleteModal bundle}}
                />
              </div>
            </Row.Td>
          </Tbody.Tr>
        {{else}}
          <Tbody.Empty>
            No meat bundles found.
          </Tbody.Empty>
        {{/each}}
      </Table.Body>
    </UiTable>

    <DeleteMeatBundleForm
      @isOpen={{this.deleteModalOpen}}
      @bundle={{this.bundleToDelete}}
      @onSave={{this.closeDeleteModal}}
      @onCancel={{this.closeDeleteModal}}
    />

    {{outlet}}
  </template>
}
