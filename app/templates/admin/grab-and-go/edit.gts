import type { RouteTemplate } from '../../../utils/route-template';
import type AdminGrabAndGoEditController from '../../../controllers/admin/grab-and-go/edit';
import type GrabAndGo from '../../../models/grab-and-go';
import BackLink from '../../../components/admin/back-link';
import ItemForm from '../../../components/admin/grab-and-go/item-form';
import Title from '../../../components/admin/title';

const AdminGrabAndGoEditTemplate: RouteTemplate<GrabAndGo, AdminGrabAndGoEditController> =
  <template>
    <BackLink @route='admin.grab-and-go' @text='Grab and Go' />

    <Title @title='Edit Grab and Go' />

    <ItemForm
      @item={{@model}}
      @saved={{@controller.itemSaved}}
      @cancelled={{@controller.itemCancelled}}
    />
  </template>;

export default AdminGrabAndGoEditTemplate;
