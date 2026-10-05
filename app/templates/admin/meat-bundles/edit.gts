import type { RouteTemplate } from '../../../utils/route-template';
import type AdminMeatBundlesEditController from '../../../controllers/admin/meat-bundles/edit';
import type MeatBundle from '../../../models/meat-bundle';
import BackLink from '../../../components/admin/back-link';
import MeatBundleForm from '../../../components/admin/meat-bundles/meat-bundle-form';
import Title from '../../../components/admin/title';

const AdminMeatBundlesEditTemplate: RouteTemplate<MeatBundle, AdminMeatBundlesEditController> =
  <template>
    <BackLink @route='admin.meat-bundles' @text='Meat Bundles' />

    <Title @title='Edit Meat Bundle' />

    <MeatBundleForm
      @bundle={{@model}}
      @saved={{@controller.bundleSaved}}
      @cancelled={{@controller.bundleCancelled}}
    />
  </template>;

export default AdminMeatBundlesEditTemplate;
