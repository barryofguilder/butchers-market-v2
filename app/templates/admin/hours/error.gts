import type { RouteTemplate } from '../../../utils/route-template';
import type { RequestError } from '../../../components/admin/page-error';
import PageError from '../../../components/admin/page-error';

const AdminHoursErrorTemplate: RouteTemplate<{ errors?: RequestError[] }> = <template>
  <PageError
    @errors={{@model.errors}}
    @name='Store Hours'
    @route='admin.hours'
    @backText='Back to Store Hours'
  />
</template>;

export default AdminHoursErrorTemplate;
