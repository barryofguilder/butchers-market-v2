import type { RouteTemplate } from '../../../utils/route-template';
import type AdminMeatBundlesNewController from '../../../controllers/admin/meat-bundles/new';
import type MeatBundle from '../../../models/meat-bundle';
import BackLink from '../../../components/admin/back-link';
import MeatBundleForm from '../../../components/admin/meat-bundles/meat-bundle-form';
import Title from '../../../components/admin/title';

const AdminMeatBundlesNewTemplate: RouteTemplate<MeatBundle, AdminMeatBundlesNewController> =
  <template>
    <BackLink @route='admin.meat-bundles' @text='Meat Bundles' />

    <Title @title='New Meat Bundle' />

    <MeatBundleForm
      @bundle={{@model}}
      @saved={{@controller.bundleSaved}}
      @cancelled={{@controller.bundleCancelled}}
    />
  </template>;

export default AdminMeatBundlesNewTemplate;
