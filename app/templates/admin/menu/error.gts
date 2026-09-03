import type { RouteTemplate } from '../../../utils/route-template';
import type { RequestError } from '../../../components/admin/page-error';
import PageError from '../../../components/admin/page-error';

const AdminMenuErrorTemplate: RouteTemplate<{ errors?: RequestError[] }> = <template>
  <PageError
    @errors={{@model.errors}}
    @name='Menu PDF'
    @route='admin.menu'
    @backText='Back to Menu PDF'
  />
</template>;

export default AdminMenuErrorTemplate;
