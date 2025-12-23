import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { TOC } from '@ember/component/template-only';
import type { WithBoundArgs } from '@glint/template';
import { action } from '@ember/object';
import { hash } from '@ember/helper';
import { on } from '@ember/modifier';
import { eq } from 'ember-truth-helpers';
import { modifier } from 'ember-modifier';
import UiIcon from '../ui-icon';

export type SortDirection = 'asc' | 'desc';

export interface ColumnOutput {
  sortColumn: string | null;
  sortDirection: SortDirection | null;
}

const DEFAULT_COLUMN_OUTPUT: ColumnOutput = {
  sortColumn: null,
  sortDirection: null,
};

/**
 * Converts a `ColumnOutput` object to a string that can be used in the sort
 * query parameter.
 *
 * @param {ColumnOutput} output The `ColumnOutput` object to convert from.
 * @returns {String} Returns a string that can be used in the sort query parameter.
 */
export function convertToSort(output: ColumnOutput) {
  let sort = output.sortColumn;

  if (output.sortDirection === 'desc') {
    sort = `-${sort}`;
  }

  return sort;
}

/**
 * Converts a sort query parameter string into a `ColumnOutput` object.
 *
 * @param {string} sort The sort query parameter string to convert from.
 * @returns {ColumnOutput} Returns a `ColumnOutput` object.
 */
export function convertToColumnOutput(sort: string | null) {
  if (sort) {
    const sortDirection = sort.startsWith('-') ? 'desc' : 'asc';
    let sortColumn = sort;

    if (sort.startsWith('-')) {
      sortColumn = sort.slice(1);
    }

    return { sortColumn, sortDirection } as ColumnOutput;
  }

  return DEFAULT_COLUMN_OUTPUT;
}

interface UiTableCellSignature {
  Element: HTMLTableCellElement;
  Args: {
    accent?: boolean;
    align?: 'left' | 'right';
    noWrap?: boolean;
  };
  Blocks: {
    default: [];
  };
}

class UiTableCell extends Component<UiTableCellSignature> {
  get align() {
    return this.args.align ?? 'left';
  }

  <template>
    <td
      class='px-3 first:pl-4 first:pr-3 sm:first:pl-6 last:pl-3 last:pr-4 sm:last:pr-6 py-4 text-sm text-gray-700
        {{if @accent "font-medium"}}
        {{if (eq this.align "right") "text-right"}}
        {{if @noWrap "whitespace-nowrap" "whitespace-normal"}}
        '
      ...attributes
    >
      {{yield}}
    </td>
  </template>
}

interface UiTableEmptySignature {
  Element: HTMLTableRowElement;
  Blocks: {
    default: [];
  };
}

const UiTableEmpty: TOC<UiTableEmptySignature> = <template>
  <tr data-test-id='no-records' class='border-b' ...attributes>
    <td class='p-3 text-gray-500 text-center italic py-6' colspan='100%'>
      {{yield}}
    </td>
  </tr>
</template>;

interface UiTableRowSignature {
  Element: HTMLTableRowElement;
  Blocks: {
    default: [
      {
        Td: WithBoundArgs<typeof UiTableCell, never>;
      },
    ];
  };
}

const UiTableRow: TOC<UiTableRowSignature> = <template>
  <tr ...attributes>
    {{yield (hash Td=(component UiTableCell))}}
  </tr>
</template>;

interface UiTableBodySignature {
  Element: HTMLElement;
  Blocks: {
    default: [
      {
        Empty: WithBoundArgs<typeof UiTableEmpty, never>;
        Tr: WithBoundArgs<typeof UiTableRow, never>;
      },
    ];
  };
}

const UiTableBody: TOC<UiTableBodySignature> = <template>
  <tbody class='divide-y divide-gray-200 bg-white' ...attributes>
    {{yield (hash Empty=(component UiTableEmpty) Tr=UiTableRow)}}
  </tbody>
</template>;

interface UiTableHeadCellSignature {
  Element: HTMLTableCellElement;
  Args: {
    align?: 'left' | 'right';
    currentSort?: ColumnOutput;
    name?: string;
    onClick?: (output: ColumnOutput) => unknown;
    reverse?: boolean;
  };
  Blocks: {
    default: [];
  };
}

class UiTableHeadCell extends Component<UiTableHeadCellSignature> {
  @tracked sortDirection: ColumnOutput['sortDirection'] = null;

  get isSortable() {
    return this.args.name !== undefined;
  }

  get sortColumn() {
    return this.sortDirection && this.args.name ? this.args.name : null;
  }

  get isAscending() {
    return this.sortDirection === 'asc';
  }

  get isDescending() {
    return this.sortDirection === 'desc';
  }

  get isSorted() {
    return this.isAscending || this.isDescending;
  }

  get isRightAligned() {
    return this.args.align === 'right';
  }

  initColumn = modifier(() => {
    const { currentSort, name } = this.args;
    const { sortColumn, sortDirection } = currentSort ?? DEFAULT_COLUMN_OUTPUT;

    this.sortDirection = sortColumn === name ? sortDirection : null;
  });

  /**
   * This is the reverse sort behavior. It will sort descending, then ascending,
   * then back to unsorted.
   */
  handleReverseSort() {
    if (this.isDescending) {
      this.sortDirection = 'asc';
    } else if (this.isAscending) {
      this.sortDirection = null;
    } else {
      this.sortDirection = 'desc';
    }
  }

  /**
   * This is the default sort behavior. It will sort ascending, then descending,
   * then back to unsorted.
   */
  handleNormalSort() {
    if (this.isAscending) {
      this.sortDirection = 'desc';
    } else if (this.isDescending) {
      this.sortDirection = null;
    } else {
      this.sortDirection = 'asc';
    }
  }

  @action
  columnClicked() {
    if (this.args.reverse) {
      this.handleReverseSort();
    } else {
      this.handleNormalSort();
    }

    this.args.onClick?.({
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
    });
  }

  <template>
    <th
      scope='col'
      class='px-3 first:pl-4 sm:first:pl-6 last:pl-3 first:pr-3 last:pr-4 sm:last:pr-6 py-3.5 text-sm font-semibold text-gray-900
        {{if this.isRightAligned "text-right" "text-left"}}'
      {{this.initColumn}}
      ...attributes
    >
      {{#if this.isSortable}}
        <button
          data-test-id='table-col-btn'
          type='button'
          class='group inline-flex'
          {{on 'click' this.columnClicked}}
        >
          {{yield}}

          {{#if this.isSorted}}
            <span
              class='transition ml-2 px-1 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200
                {{if this.isAscending "-rotate-180"}}'
            >
              <UiIcon
                data-test-id='{{if this.isAscending "sort-asc" "sort-desc"}}'
                @icon='chevron-down'
              />
            </span>
          {{/if}}
        </button>
      {{else}}
        {{yield}}
      {{/if}}
    </th>
  </template>
}

interface UiTableHeadSignature {
  Element: HTMLElement;
  Args: {
    currentSort?: ColumnOutput;
    onColumnClick?: (output: ColumnOutput) => unknown;
  };
  Blocks: {
    default: [
      {
        Th: WithBoundArgs<typeof UiTableHeadCell, 'currentSort' | 'onClick'>;
      },
    ];
  };
}

const UiTableHead: TOC<UiTableHeadSignature> = <template>
  <thead>
    <tr>
      {{yield
        (hash Th=(component UiTableHeadCell currentSort=@currentSort onClick=@onColumnClick))
      }}
    </tr>
  </thead>
</template>;

export interface UiTableSignature {
  Element: HTMLTableElement;
  Blocks: {
    default: [
      {
        Body: WithBoundArgs<typeof UiTableBody, never>;
        Head: WithBoundArgs<typeof UiTableHead, never>;
      },
    ];
  };
}

const UiTableComponent: TOC<UiTableSignature> = <template>
  <table class='min-w-full divide-y divide-gray-300' ...attributes>
    {{yield (hash Body=(component UiTableBody) Head=(component UiTableHead))}}
  </table>
</template>;

export default UiTableComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    UiTable: typeof UiTableComponent;
  }
}
