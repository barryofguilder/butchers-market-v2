import type { RouteTemplate } from '../../../utils/route-template';
import type AdminFeatureFlagsNewController from '../../../controllers/admin/feature-flags/new';
import type FeatureFlag from '../../../models/feature-flag';
import BackLink from '../../../components/admin/back-link';
import FeatureFlagForm from '../../../components/admin/feature-flags/feature-flag-form';
import Title from '../../../components/admin/title';

const AdminFeatureFlagsNewTemplate: RouteTemplate<FeatureFlag, AdminFeatureFlagsNewController> =
  <template>
    <BackLink @route="admin.feature-flags" @text="Feature Flags" />

    <Title @title="New Feature Flag" />

    <FeatureFlagForm
      @flag={{@model}}
      @saved={{@controller.flagSaved}}
      @cancelled={{@controller.flagCancelled}}
    />
  </template>;

export default AdminFeatureFlagsNewTemplate;
