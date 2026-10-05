import type { TOC } from '@ember/component/template-only';
import type { RequestError } from '../../../components/admin/page-error';
import PageError from '../../../components/admin/page-error';

interface Signature {
  Args: {
    model: { errors?: RequestError[] };
  };
}

const AdminGrabAndGoErrorTemplate: TOC<Signature> = <template>
  <PageError
    @errors={{@model.errors}}
    @name="Grab and Go"
    @route="admin.grab-and-go"
    @backText="Back to Grab and Go"
  />
</template>;

export default AdminGrabAndGoErrorTemplate;
