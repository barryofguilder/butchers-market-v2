import type { RouteTemplate } from '../../../utils/route-template';
import type GrabAndGo from '../../../models/grab-and-go';
import BackLink from '../../../components/admin/back-link';
import SocialList from '../../../components/admin/grab-and-go/social-list';
import Title from '../../../components/admin/title';

const AdminGrabAndGoSocialTemplate: RouteTemplate<GrabAndGo[]> = <template>
  <BackLink @route='admin.grab-and-go' @text='Grab and Go' />

  <Title @title='Grab and Go - Social Titles' />

  <SocialList @items={{@model}} />
</template>;

export default AdminGrabAndGoSocialTemplate;
