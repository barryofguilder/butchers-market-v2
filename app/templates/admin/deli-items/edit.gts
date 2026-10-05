import type { RouteTemplate } from '../../../utils/route-template';
import type AdminDeliItemsEditController from '../../../controllers/admin/deli-items/edit';
import type DeliItem from '../../../models/deli-item';
import BackLink from '../../../components/admin/back-link';
import DeliItemForm from '../../../components/admin/deli-items/deli-item-form';
import Title from '../../../components/admin/title';

const AdminDeliItemsEditTemplate: RouteTemplate<DeliItem, AdminDeliItemsEditController> = <template>
  <BackLink @route="admin.deli-items" @text="Deli Items" />

  <Title @title="Edit Deli Item" />

  <DeliItemForm
    @item={{@model}}
    @saved={{@controller.deliItemSaved}}
    @cancelled={{@controller.deliItemCancelled}}
  />
</template>;

export default AdminDeliItemsEditTemplate;
