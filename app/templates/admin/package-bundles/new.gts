import type { RouteTemplate } from '../../../utils/route-template';
import type AdminPackageBundlesNewController from '../../../controllers/admin/package-bundles/new';
import type PackageBundle from '../../../models/package-bundle';
import BackLink from '../../../components/admin/back-link';
import PackageBundleForm from '../../../components/admin/package-bundles/package-bundle-form';
import Title from '../../../components/admin/title';

const AdminPackageBundlesNewTemplate: RouteTemplate<
  PackageBundle,
  AdminPackageBundlesNewController
> = <template>
  <BackLink @route="admin.package-bundles" @text="Package Bundles" />

  <Title @title="New Package Bundle" />

  <PackageBundleForm
    @bundle={{@model}}
    @saved={{@controller.bundleSaved}}
    @cancelled={{@controller.bundleCancelled}}
  />
</template>;

export default AdminPackageBundlesNewTemplate;
