import type { TOC } from '@ember/component/template-only';
import type { GrabAndGo } from '../../../schemas/grab-and-go';
import BackLink from '../../../components/admin/back-link';
import SocialList from '../../../components/admin/grab-and-go/social-list';
import Title from '../../../components/admin/title';

interface Signature {
  Args: {
    model: GrabAndGo[];
  };
}

const AdminGrabAndGoSocialTemplate: TOC<Signature> = <template>
  <BackLink @route="admin.grab-and-go" @text="Grab and Go" />

  <Title @title="Grab and Go - Social Titles" />

  <SocialList @items={{@model}} />
</template>;

export default AdminGrabAndGoSocialTemplate;
