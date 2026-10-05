import type { TOC } from '@ember/component/template-only';
import type { RequestError } from '../../../components/admin/page-error';
import PageError from '../../../components/admin/page-error';

interface Signature {
  Args: {
    model: { errors?: RequestError[] };
  };
}

const AdminDeliItemsErrorTemplate: TOC<Signature> = <template>
  <PageError
    @errors={{@model.errors}}
    @name="Deli Item"
    @route="admin.deli-items"
    @backText="Back to Deli Items"
  />
</template>;

export default AdminDeliItemsErrorTemplate;
