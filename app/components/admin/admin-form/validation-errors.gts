import type { TOC } from '@ember/component/template-only';
import { gt } from 'ember-truth-helpers';
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';

const ValidationErrors: TOC<{
  Element: HTMLUListElement;
  Args: {
    errors?: string[];
  };
}> = <template>
  {{#if (gt @errors.length 0)}}
    <ul data-test-id='validation-errors' class='text-red-700 text-sm' ...attributes>
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
