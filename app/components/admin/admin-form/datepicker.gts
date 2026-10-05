import Component from '@glimmer/component';
import type { ComponentLike } from '@glint/template';
import EmberFlatpickrComponent from 'ember-flatpickr/components/ember-flatpickr';
import type { BaseOptions as FlatpickrOptions } from 'flatpickr/dist/types/options';

/**
 * ember-flatpickr types every flatpickr option as a required argument, so no caller can satisfy
 * it. Every option is optional at runtime, so treat them that way here.
 */
const EmberFlatpickr = EmberFlatpickrComponent as unknown as ComponentLike<{
  Element: HTMLInputElement;
  Args: Partial<FlatpickrOptions> & {
    date?: FlatpickrOptions['defaultDate'];
    disabled?: boolean;
  };
}>;

export interface DatepickerSignature {
  Element: HTMLInputElement;
  Args: {
    allowInput?: boolean;
    date: Date | null | undefined;
    dateFormat?: string;
    errors?: string[];
    id?: string;
    onChange: (selectedDates: Date[]) => void;
  };
}

export default class DatepickerComponent extends Component<DatepickerSignature> {
  /**
   * An empty list clears the picker, the same as passing no date.
   */
  get date() {
    return this.args.date ?? [];
  }

  get hasErrors() {
    return (this.args.errors ?? []).length > 0;
  }

  get inputClasses() {
    let classes = 'styled-textbox ember-flatpickr';

    if (this.hasErrors) {
      classes += ' has-errors';
    }

    return classes;
  }

  <template>
    <EmberFlatpickr
      @allowInput={{@allowInput}}
      @date={{this.date}}
      @dateFormat={{@dateFormat}}
      @disableMobile={{true}}
      @onChange={{@onChange}}
      data-test-id="datepicker"
      id={{@id}}
      class={{this.inputClasses}}
      ...attributes
    />
  </template>
}
