import type { TOC } from '@ember/component/template-only';
import type { RequestError } from '../../../components/admin/page-error';
import PageError from '../../../components/admin/page-error';

interface Signature {
  Args: {
    model: { errors?: RequestError[] };
  };
}

const AdminSpecialsErrorTemplate: TOC<Signature> = <template>
  <PageError
    @errors={{@model.errors}}
    @name="Special"
    @route="admin.specials"
    @backText="Back to Specials"
  />
</template>;

export default AdminSpecialsErrorTemplate;
