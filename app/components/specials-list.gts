import type { TOC } from '@ember/component/template-only';
import sortBy from '../helpers/sort-by';
import type Special from '../models/special';
import SpecialListItem from './specials-list/special-list-item';

const SpecialsList: TOC<{
  Element: HTMLDivElement;
  Args: {
    specials: Special[];
  };
}> = <template>
  <div class='sm:-mx-3 sm:flex sm:items-center sm:flex-wrap' ...attributes>
    {{#each (sortBy 'displayOrder' @specials) as |special|}}
      <div class='sm:px-3 sm:w-1/2 lg:w-1/3'>
        <SpecialListItem @special={{special}} />
      </div>
    {{/each}}
  </div>
</template>;

export default SpecialsList;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    SpecialsList: typeof SpecialsList;
  }
}
