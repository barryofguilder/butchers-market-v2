import type { RouteTemplate } from '../../../utils/route-template';
import type { RequestError } from '../../../components/admin/page-error';
import PageError from '../../../components/admin/page-error';

const AdminFeatureFlagsErrorTemplate: RouteTemplate<{ errors?: RequestError[] }> = <template>
  <PageError
    @errors={{@model.errors}}
    @name='Feature Flag'
    @route='admin.feature-flags'
    @backText='Back to Feature Flags'
  />
</template>;

export default AdminFeatureFlagsErrorTemplate;
