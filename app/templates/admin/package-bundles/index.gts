import { eq } from 'ember-truth-helpers';
import type { RouteTemplate } from '../../../utils/route-template';
import type AdminPackageBundlesIndexController from '../../../controllers/admin/package-bundles/index';
import type PackageBundle from '../../../models/package-bundle';
import BackLink from '../../../components/admin/back-link';
import DeletePackageBundleForm from '../../../components/admin/package-bundles/delete-package-bundle-form';
import Title from '../../../components/admin/title';
import UiTable from '../../../components/admin/ui-table';
import UiButton from '../../../components/ui-button';

const AdminPackageBundlesIndexTemplate: RouteTemplate<
  PackageBundle[],
  AdminPackageBundlesIndexController
> = <template>
  <BackLink @route="admin.index" @text="Admin" />

  <Title @title="Package Bundles" />

  {{! Hiding the new button until it's needed }}
  {{! <div class="mt-8">
    <UiButton @route="admin.package-bundles.new" @icon="plus" @size="medium" @variant="plain">
      New
    </UiButton>
  </div> }}

  <UiTable class="mt-8" as |Table|>
    <Table.Head as |Thead|>
      <Thead.Th>Title</Thead.Th>
      <Thead.Th>Prices</Thead.Th>
      <Thead.Th class="hidden md:table-cell">Special Text</Thead.Th>
      <Thead.Th class="hidden md:table-cell">Items</Thead.Th>
      <Thead.Th />
    </Table.Head>
    <Table.Body as |Tbody|>
      {{#each @controller.sortedBundles as |bundle|}}
        {{! Hiding "Ice Box" for now, might delete later if not needed anymore. }}
        {{#unless (eq bundle.title "Ice Box Mix N' Match")}}
          <Tbody.Tr as |Row|>
            <Row.Td>{{bundle.title}}</Row.Td>
            <Row.Td>
              <ul>
                {{#each bundle.prices as |price|}}
                  <li>{{price}}</li>
                {{/each}}
              </ul>
            </Row.Td>
            <Row.Td class="hidden md:table-cell">{{bundle.specialText}}</Row.Td>
            <Row.Td class="hidden md:table-cell">
              {{#if bundle.items}}
                {{bundle.items.length}}
                Items
              {{else}}
                0 Items
              {{/if}}
            </Row.Td>
            <Row.Td>
              <div class="flex justify-end">
                <UiButton
                  @route="admin.package-bundles.edit"
                  @model={{bundle.id}}
                  @iconOnly={{true}}
                  @icon="pencil-alt"
                  @variant="secondary"
                />

                {{! Hiding the delete button until it's needed }}
                {{!-- <UiButton
                class="ml-1"
                @iconOnly={{true}}
                @icon="trash-alt"
                @variant="danger"
                @onClick={{fn this.openDeleteModal bundle}}
              /> --}}
              </div>
            </Row.Td>
          </Tbody.Tr>
        {{/unless}}
      {{else}}
        <Tbody.Empty>
          No package bundles found.
        </Tbody.Empty>
      {{/each}}
    </Table.Body>
  </UiTable>

  <DeletePackageBundleForm
    @isOpen={{@controller.deleteModalOpen}}
    @bundle={{@controller.bundleToDelete}}
    @onSave={{@controller.closeDeleteModal}}
    @onCancel={{@controller.closeDeleteModal}}
  />

  {{outlet}}
</template>;

export default AdminPackageBundlesIndexTemplate;
