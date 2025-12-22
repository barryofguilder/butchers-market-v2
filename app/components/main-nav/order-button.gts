import type { TOC } from '@ember/component/template-only';
import UiButton from '../ui-button';
import { ORDER_ONLINE_URL } from '../../utils/config';

const MainNavOrderButtonComponent: TOC<{ Element: null }> = <template>
  <UiButton @variant='primary' @size='medium' @href={{ORDER_ONLINE_URL}}>
    Order Online
  </UiButton>
</template>;

export default MainNavOrderButtonComponent;
