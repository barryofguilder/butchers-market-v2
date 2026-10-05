import type { RouteTemplate } from '../../../utils/route-template';
import type AdminHoursNewController from '../../../controllers/admin/hours/new';
import type Hour from '../../../models/hour';
import BackLink from '../../../components/admin/back-link';
import HoursForm from '../../../components/admin/hours/hours-form';
import Title from '../../../components/admin/title';

const AdminHoursNewTemplate: RouteTemplate<Hour, AdminHoursNewController> = <template>
  <BackLink @route='admin.hours' @text='Store Hours' />

  <Title @title='New Hours' />

  <HoursForm
    @hours={{@model}}
    @saved={{@controller.hoursSaved}}
    @cancelled={{@controller.hoursCancelled}}
  />
</template>;

export default AdminHoursNewTemplate;
