import type { TOC } from '@ember/component/template-only';
import { LinkTo } from '@ember/routing';
// TODO: Fix this...
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import UiIcon from '../ui-icon';

const BackLink: TOC<{
  Element: HTMLDivElement;
  Args: {
    route: string;
    text?: string;
  };
  Blocks: {
    default: [];
  };
}> = <template>
  <div ...attributes>
    <LinkTo @route={{@route}} class='inline-block'>
      <div class='flex items-center text-red-700 hover:text-red-800 focus:text-red-800'>
        <UiIcon @icon='chevron-left' @size='sm' />
        <div class='ml-2'>
          {{#if (has-block)}}
            {{yield}}
          {{else}}
            {{@text}}
          {{/if}}
        </div>
      </div>
    </LinkTo>
  </div>
</template>;

export default BackLink;
