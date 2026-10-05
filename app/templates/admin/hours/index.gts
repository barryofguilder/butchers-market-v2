import { fn } from '@ember/helper';
import type { RouteTemplate } from '../../../utils/route-template';
import type AdminHoursIndexController from '../../../controllers/admin/hours/index';
import type Hour from '../../../models/hour';
import dateFormat from '../../../helpers/date-format';
import BackLink from '../../../components/admin/back-link';
import DeleteHoursForm from '../../../components/admin/hours/delete-hours-form';
import Title from '../../../components/admin/title';
import UiTable from '../../../components/admin/ui-table';
import UiButton from '../../../components/ui-button';

const AdminHoursIndexTemplate: RouteTemplate<Hour[], AdminHoursIndexController> = <template>
  <BackLink @route="admin.index" @text="Admin" />

  <Title @title="Store Hours" />

  <div class="mt-8">
    <UiButton @route="admin.hours.new" @icon="plus" @size="medium" @variant="plain">
      New
    </UiButton>
  </div>

  <UiTable class="mt-8" as |Table|>
    <Table.Head as |Thead|>
      <Thead.Th>Type</Thead.Th>
      <Thead.Th>Label</Thead.Th>
      <Thead.Th class="hidden md:table-cell">Active Start Date</Thead.Th>
      <Thead.Th class="hidden md:table-cell">Active End Date</Thead.Th>
      <Thead.Th class="hidden md:table-cell">Lines</Thead.Th>
      <Thead.Th />
    </Table.Head>
    <Table.Body as |Tbody|>
      {{#each @model as |hours|}}
        <Tbody.Tr as |Row|>
          <Row.Td>
            <div>{{hours.type}}</div>
            {{#if hours.default}}
              <span class="inline-block px-2 bg-blue-200 text-blue-800 text-sm rounded-sm">
                Default
              </span>
            {{/if}}
          </Row.Td>
          <Row.Td>{{hours.label}}</Row.Td>
          <Row.Td class="hidden md:table-cell">
            {{#if hours.activeStartDate}}
              {{dateFormat hours.activeStartDate "LL/dd/yyyy"}}
            {{/if}}
          </Row.Td>
          <Row.Td class="hidden md:table-cell">
            {{#if hours.activeEndDate}}
              {{dateFormat hours.activeEndDate "LL/dd/yyyy"}}
            {{/if}}
          </Row.Td>
          <Row.Td class="hidden md:table-cell">
            <ul class="list-disc list-inside">
              <li>{{hours.line1}}</li>
              {{#if hours.line2}}
                <li>{{hours.line2}}</li>
              {{/if}}
              {{#if hours.line3}}
                <li>{{hours.line3}}</li>
              {{/if}}
            </ul>
          </Row.Td>
          <Row.Td>
            <div class="flex justify-end">
              <UiButton
                @route="admin.hours.edit"
                @model={{hours.id}}
                @iconOnly={{true}}
                @icon="pencil-alt"
                @variant="secondary"
              />

              <UiButton
                class="ml-1"
                @iconOnly={{true}}
                @icon="trash-alt"
                @variant="danger"
                @disabled={{if hours.default true false}}
                @onClick={{fn @controller.openDeleteModal hours}}
              />
            </div>
          </Row.Td>
        </Tbody.Tr>
      {{else}}
        <Tbody.Empty>
          No hours found.
        </Tbody.Empty>
      {{/each}}
    </Table.Body>
  </UiTable>

  <DeleteHoursForm
    @isOpen={{@controller.deleteModalOpen}}
    @hours={{@controller.hoursToDelete}}
    @onSave={{@controller.closeDeleteModal}}
    @onCancel={{@controller.closeDeleteModal}}
  />

  {{outlet}}
</template>;

export default AdminHoursIndexTemplate;
