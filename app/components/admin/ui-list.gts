import Component from '@glimmer/component';
import type { TOC } from '@ember/component/template-only';
import type { EmptyObject } from '@ember/component/helper';
import type { WithBoundArgs } from '@glint/template';
import { hash } from '@ember/helper';
import type { RouteModel } from '@ember/routing/router-service';
import UiBaseLink from '../ui-base-link';
import UiIcon from '../ui-icon';

interface UiListItemSignature {
  Element: HTMLLIElement;
  Args: {
    href?: string;
    model?: RouteModel;
    models?: [RouteModel];
    query?: Record<string, unknown>;
    route?: string;
  };
  Blocks: {
    default: [];
  };
}

class UiListItem extends Component<UiListItemSignature> {
  get isLink() {
    return this.args.href || this.args.route;
  }

  <template>
    <li class='relative {{unless this.isLink "py-5 px-4"}}' ...attributes>
      {{#if this.isLink}}
        <UiBaseLink
          @href={{@href}}
          @route={{@route}}
          @model={{@model}}
          @models={{@models}}
          @query={{@query}}
          class='py-5 px-4 flex justify-between items-center gap-x-6 hover:bg-gray-50'
        >
          <span>{{yield}}</span>
          <UiIcon @icon='chevron-right' class='text-gray-400' />
        </UiBaseLink>
      {{else}}
        {{yield}}
      {{/if}}
    </li>
  </template>
}

export interface UiListSignature {
  Element: HTMLUListElement;
  Args: EmptyObject;
  Blocks: {
    default: [
      {
        Item: WithBoundArgs<typeof UiListItem, never>;
      },
    ];
  };
}

const UiListComponent: TOC<UiListSignature> = <template>
  <ul
    role='list'
    class='border border-gray-200 divide-y divide-gray-200 rounded-md overflow-hidden'
    ...attributes
  >
    {{yield (hash Item=(component UiListItem))}}
  </ul>
</template>;

export default UiListComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Admin::UiList': typeof UiListComponent;
  }
}
