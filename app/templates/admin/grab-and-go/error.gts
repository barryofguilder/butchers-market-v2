import type { RouteTemplate } from '../../../utils/route-template';
import type { RequestError } from '../../../components/admin/page-error';
import PageError from '../../../components/admin/page-error';

const AdminGrabAndGoErrorTemplate: RouteTemplate<{ errors?: RequestError[] }> = <template>
  <PageError
    @errors={{@model.errors}}
    @name='Grab and Go'
    @route='admin.grab-and-go'
    @backText='Back to Grab and Go'
  />
</template>;

export default AdminGrabAndGoErrorTemplate;
