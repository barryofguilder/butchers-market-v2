import type { RouteTemplate } from '../../../utils/route-template';
import type AdminSpecialsEditController from '../../../controllers/admin/specials/edit';
import type Special from '../../../models/special';
import BackLink from '../../../components/admin/back-link';
import SpecialForm from '../../../components/admin/specials/special-form';
import Title from '../../../components/admin/title';

const AdminSpecialsEditTemplate: RouteTemplate<Special, AdminSpecialsEditController> = <template>
  <BackLink @route='admin.specials' @text='Specials' />

  <Title @title='Edit Special' />

  <SpecialForm
    @special={{@model}}
    @saved={{@controller.specialSaved}}
    @cancelled={{@controller.specialCancelled}}
  />
</template>;

export default AdminSpecialsEditTemplate;
