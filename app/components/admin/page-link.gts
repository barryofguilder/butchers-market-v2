import type { TOC } from '@ember/component/template-only';
import { LinkTo } from '@ember/routing';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import UiIcon from '../ui-icon';

const PageLink: TOC<{
  Element: HTMLAnchorElement;
  Args: {
    route: string;
  };
  Blocks: {
    default: [];
  };
}> = <template>
  <LinkTo
    @route={{@route}}
    class='block hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out'
  >
    <div class='flex justify-between items-center px-4 py-4 sm:px-6'>
      <div>
        {{yield}}
      </div>
      <div>
        <UiIcon class='text-gray-600' @icon='chevron-right' />
      </div>
    </div>
  </LinkTo>
</template>;

export default PageLink;
