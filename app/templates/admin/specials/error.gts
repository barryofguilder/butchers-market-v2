import type { RouteTemplate } from '../../../utils/route-template';
import type { RequestError } from '../../../components/admin/page-error';
import PageError from '../../../components/admin/page-error';

const AdminSpecialsErrorTemplate: RouteTemplate<{ errors?: RequestError[] }> = <template>
  <PageError
    @errors={{@model.errors}}
    @name='Special'
    @route='admin.specials'
    @backText='Back to Specials'
  />
</template>;

export default AdminSpecialsErrorTemplate;
