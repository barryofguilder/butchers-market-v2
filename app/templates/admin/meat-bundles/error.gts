import type { TOC } from '@ember/component/template-only';
import type { RequestError } from '../../../components/admin/page-error';
import PageError from '../../../components/admin/page-error';

interface Signature {
  Args: {
    model: { errors?: RequestError[] };
  };
}

const AdminMeatBundlesErrorTemplate: TOC<Signature> = <template>
  <PageError
    @errors={{@model.errors}}
    @name="Meat Bundle"
    @route="admin.meat-bundles"
    @backText="Back to Meat Bundles"
  />
</template>;

export default AdminMeatBundlesErrorTemplate;
