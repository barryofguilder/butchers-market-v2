import type { TOC } from '@ember/component/template-only';
import { LinkTo } from '@ember/routing';
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
      <div class='flex items-center text-red-800 hover:text-red-900 focus:text-red-900'>
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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Admin::BackLink': typeof BackLink;
  }
}
