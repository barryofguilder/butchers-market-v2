import type { TOC } from '@ember/component/template-only';
import type { RequestError } from '../../../components/admin/page-error';
import PageError from '../../../components/admin/page-error';

interface Signature {
  Args: {
    model: { errors?: RequestError[] };
  };
}

const AdminFeatureFlagsErrorTemplate: TOC<Signature> = <template>
  <PageError
    @errors={{@model.errors}}
    @name="Feature Flag"
    @route="admin.feature-flags"
    @backText="Back to Feature Flags"
  />
</template>;

export default AdminFeatureFlagsErrorTemplate;
