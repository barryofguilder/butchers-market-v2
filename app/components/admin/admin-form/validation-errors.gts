import type { TOC } from '@ember/component/template-only';
import type { EmptyObject } from '@ember/component/helper';
import { gt } from 'ember-truth-helpers';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';

const ValidationErrors: TOC<{
  Element: HTMLUListElement;
  Args: {
    // TODO: Is this the correct type?
    errors?: string[];
  };
  Blocks: EmptyObject;
}> = <template>
  {{#if (gt @errors.length 0)}}
    <ul data-test-id='validation-errors' class='text-red text-sm' ...attributes>
      {{#each @errors as |error|}}
        <li data-test-id='validation-error' class='my-1'>
          <FaIcon @icon='exclamation-triangle' />
          <span class='pl-1'>{{error}}</span>
        </li>
      {{/each}}
    </ul>
  {{/if}}
</template>;

export default ValidationErrors;
