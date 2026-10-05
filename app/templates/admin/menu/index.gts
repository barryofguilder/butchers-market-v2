import type { RouteTemplate } from '../../../utils/route-template';
import type Menu from '../../../models/menu';
import dateFormat from '../../../helpers/date-format';
import BackLink from '../../../components/admin/back-link';
import Title from '../../../components/admin/title';
import UiTable from '../../../components/admin/ui-table';
import UiButton from '../../../components/ui-button';

const AdminMenuIndexTemplate: RouteTemplate<Menu[]> = <template>
  <BackLink @route='admin.index' @text='Admin' />

  <Title @title='Menu PDF' />

  <UiTable class='mt-8' as |Table|>
    <Table.Head as |Thead|>
      <Thead.Th>Last Updated At</Thead.Th>
      <Thead.Th />
    </Table.Head>
    <Table.Body as |Tbody|>
      {{#each @model as |menu|}}
        <Tbody.Tr as |Row|>
          <Row.Td>{{dateFormat menu.updatedAt 'LL/dd/yyyy h:mma'}}</Row.Td>

          <Row.Td>
            <div class='flex justify-end'>
              <UiButton
                @route='admin.menu.edit'
                @model={{menu.id}}
                @iconOnly={{true}}
                @icon='pencil-alt'
                @variant='secondary'
              />
            </div>
          </Row.Td>
        </Tbody.Tr>
      {{else}}
        <Tbody.Empty>
          No menus found.
        </Tbody.Empty>
      {{/each}}
    </Table.Body>
  </UiTable>

  {{outlet}}
</template>;

export default AdminMenuIndexTemplate;
