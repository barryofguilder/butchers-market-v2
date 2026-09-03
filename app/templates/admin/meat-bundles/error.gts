import type { RouteTemplate } from '../../../utils/route-template';
import type { RequestError } from '../../../components/admin/page-error';
import PageError from '../../../components/admin/page-error';

const AdminMeatBundlesErrorTemplate: RouteTemplate<{ errors?: RequestError[] }> = <template>
  <PageError
    @errors={{@model.errors}}
    @name='Meat Bundle'
    @route='admin.meat-bundles'
    @backText='Back to Meat Bundles'
  />
</template>;

export default AdminMeatBundlesErrorTemplate;
