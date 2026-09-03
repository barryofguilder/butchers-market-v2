import type { RouteTemplate } from '../../../utils/route-template';
import type { RequestError } from '../../../components/admin/page-error';
import PageError from '../../../components/admin/page-error';

const AdminPackageBundlesErrorTemplate: RouteTemplate<{ errors?: RequestError[] }> = <template>
  <PageError
    @errors={{@model.errors}}
    @name='Package Bundle'
    @route='admin.package-bundles'
    @backText='Back to Package Bundles'
  />
</template>;

export default AdminPackageBundlesErrorTemplate;
