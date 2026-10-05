import type { TOC } from '@ember/component/template-only';
import type { RequestError } from '../../../components/admin/page-error';
import PageError from '../../../components/admin/page-error';

interface Signature {
  Args: {
    model: { errors?: RequestError[] };
  };
}

const AdminPackageBundlesErrorTemplate: TOC<Signature> = <template>
  <PageError
    @errors={{@model.errors}}
    @name="Package Bundle"
    @route="admin.package-bundles"
    @backText="Back to Package Bundles"
  />
</template>;

export default AdminPackageBundlesErrorTemplate;
