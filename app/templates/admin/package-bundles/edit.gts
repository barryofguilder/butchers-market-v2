import type { RouteTemplate } from '../../../utils/route-template';
import type AdminPackageBundlesEditController from '../../../controllers/admin/package-bundles/edit';
import type PackageBundle from '../../../models/package-bundle';
import BackLink from '../../../components/admin/back-link';
import PackageBundleForm from '../../../components/admin/package-bundles/package-bundle-form';
import Title from '../../../components/admin/title';

const AdminPackageBundlesEditTemplate: RouteTemplate<
  PackageBundle,
  AdminPackageBundlesEditController
> = <template>
  <BackLink @route='admin.package-bundles' @text='Package Bundles' />

  <Title @title='Edit Package Bundle' />

  <PackageBundleForm
    @bundle={{@model}}
    @saved={{@controller.bundleSaved}}
    @cancelled={{@controller.bundleCancelled}}
  />
</template>;

export default AdminPackageBundlesEditTemplate;
