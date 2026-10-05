import type { RouteTemplate } from '../../../utils/route-template';
import type AdminMenuEditController from '../../../controllers/admin/menu/edit';
import type Menu from '../../../models/menu';
import BackLink from '../../../components/admin/back-link';
import MenuForm from '../../../components/admin/menu/menu-form';
import Title from '../../../components/admin/title';

const AdminMenuEditTemplate: RouteTemplate<Menu, AdminMenuEditController> = <template>
  <BackLink @route="admin.menu" @text="Menu PDF" />

  <Title @title="Edit Menu PDF" />

  <MenuForm
    @menu={{@model}}
    @saved={{@controller.menuSaved}}
    @cancelled={{@controller.menuCancelled}}
  />
</template>;

export default AdminMenuEditTemplate;
