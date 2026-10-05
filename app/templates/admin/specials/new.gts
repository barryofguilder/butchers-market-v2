import type { RouteTemplate } from '../../../utils/route-template';
import type AdminSpecialsNewController from '../../../controllers/admin/specials/new';
import type Special from '../../../models/special';
import BackLink from '../../../components/admin/back-link';
import SpecialForm from '../../../components/admin/specials/special-form';
import Title from '../../../components/admin/title';

const AdminSpecialsNewTemplate: RouteTemplate<Special, AdminSpecialsNewController> = <template>
  <BackLink @route='admin.specials' @text='Specials' />

  <Title @title='New Special' />

  <SpecialForm
    @special={{@model}}
    @saved={{@controller.specialSaved}}
    @cancelled={{@controller.specialCancelled}}
  />
</template>;

export default AdminSpecialsNewTemplate;
