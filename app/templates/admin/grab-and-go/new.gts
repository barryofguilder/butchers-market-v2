import type { RouteTemplate } from '../../../utils/route-template';
import type AdminGrabAndGoNewController from '../../../controllers/admin/grab-and-go/new';
import type GrabAndGo from '../../../models/grab-and-go';
import BackLink from '../../../components/admin/back-link';
import ItemForm from '../../../components/admin/grab-and-go/item-form';
import Title from '../../../components/admin/title';

const AdminGrabAndGoNewTemplate: RouteTemplate<GrabAndGo, AdminGrabAndGoNewController> = <template>
  <BackLink @route="admin.grab-and-go" @text="Grab and Go" />

  <Title @title="New Grab and Go" />

  <ItemForm
    @item={{@model}}
    @saved={{@controller.itemSaved}}
    @cancelled={{@controller.itemCancelled}}
  />
</template>;

export default AdminGrabAndGoNewTemplate;
