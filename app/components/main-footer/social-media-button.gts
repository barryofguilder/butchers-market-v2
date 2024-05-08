import type { TOC } from '@ember/component/template-only';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';

const SocialMediaButton: TOC<{
  Element: HTMLAnchorElement;
  Args: {
    href: string;
    icon: string;
  };
  Blocks: {
    default: [];
  };
}> = <template>
  <a
    href={{@href}}
    class='inline-block h-8 w-8 text-center text-xl text-gray-900 border border-gray-900 rounded hover:bg-gray-900 hover:text-white'
    ...attributes
  >
    <FaIcon @icon={{@icon}} @prefix='fab' />
  </a>
</template>;

export default SocialMediaButton;
