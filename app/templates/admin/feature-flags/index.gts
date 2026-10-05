import { fn } from '@ember/helper';
import type { RouteTemplate } from '../../../utils/route-template';
import type AdminFeatureFlagsIndexController from '../../../controllers/admin/feature-flags/index';
import type FeatureFlag from '../../../models/feature-flag';
import BackLink from '../../../components/admin/back-link';
import DeleteFeatureFlagForm from '../../../components/admin/feature-flags/delete-feature-flag-form';
import Title from '../../../components/admin/title';
import UiTable from '../../../components/admin/ui-table';
import UiAlert from '../../../components/ui-alert';
import UiButton from '../../../components/ui-button';

const AdminFeatureFlagsIndexTemplate: RouteTemplate<
  FeatureFlag[],
  AdminFeatureFlagsIndexController
> = <template>
  <BackLink @route='admin.index' @text='Admin' />

  <Title @title='Feature Flags' />

  <UiAlert @variant='warning'>
    Drew, this is something just for me. It allows me to turn on/off features without having to
    deploy code.
  </UiAlert>

  <div class='mt-8'>
    <UiButton @route='admin.feature-flags.new' @icon='plus' @size='medium' @variant='plain'>
      New
    </UiButton>
  </div>

  <UiTable class='mt-8' as |Table|>
    <Table.Head as |Thead|>
      <Thead.Th>Name</Thead.Th>
      <Thead.Th>Is Active?</Thead.Th>
      <Thead.Th />
    </Table.Head>
    <Table.Body as |Tbody|>
      {{#each @model as |flag|}}
        <Tbody.Tr as |Row|>
          <Row.Td>{{flag.name}}</Row.Td>
          <Row.Td>
            {{if flag.active 'Yes' 'No'}}
          </Row.Td>
          <Row.Td>
            <div class='flex justify-end'>
              <UiButton
                @route='admin.feature-flags.edit'
                @model={{flag.id}}
                @iconOnly={{true}}
                @icon='pencil-alt'
                @variant='secondary'
              />

              <UiButton
                class='ml-1'
                @iconOnly={{true}}
                @icon='trash-alt'
                @variant='danger'
                @onClick={{fn @controller.openDeleteModal flag}}
              />
            </div>
          </Row.Td>
        </Tbody.Tr>
      {{else}}
        <Tbody.Empty>
          No feature flags found.
        </Tbody.Empty>
      {{/each}}
    </Table.Body>
  </UiTable>

  <DeleteFeatureFlagForm
    @isOpen={{@controller.deleteModalOpen}}
    @flag={{@controller.flagToDelete}}
    @onSave={{@controller.closeDeleteModal}}
    @onCancel={{@controller.closeDeleteModal}}
  />

  {{outlet}}
</template>;

export default AdminFeatureFlagsIndexTemplate;
