import type { RouteTemplate } from '../../../utils/route-template';
import type AdminHoursEditController from '../../../controllers/admin/hours/edit';
import type Hour from '../../../models/hour';
import BackLink from '../../../components/admin/back-link';
import HoursForm from '../../../components/admin/hours/hours-form';
import Title from '../../../components/admin/title';

const AdminHoursEditTemplate: RouteTemplate<Hour, AdminHoursEditController> = <template>
  <BackLink @route='admin.hours' @text='Store Hours' />

  <Title @title='Edit Hours' />

  <HoursForm
    @hours={{@model}}
    @saved={{@controller.hoursSaved}}
    @cancelled={{@controller.hoursCancelled}}
  />
</template>;

export default AdminHoursEditTemplate;
