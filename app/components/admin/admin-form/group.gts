import Component from '@glimmer/component';
import type { WithBoundArgs } from '@glint/template';
import { guidFor } from '@ember/object/internals';
import { hash } from '@ember/helper';
import { valueOrDefault } from '../../../utils/value-or-default';
import Checkbox from './checkbox';
import Datepicker from './datepicker';
import Help from './help';
import Label from './label';
import UiTextbox from '../../ui-textbox';
import UiTextarea from '../../ui-textarea';
import ValidationErrors from './validation-errors';

interface ValidationError {
  key: string;
  validation: string[];
  value: string;
}

interface ModelStub {
  errors?: ValidationError[];
}

export interface GroupSignature {
  Element: HTMLDivElement;
  Args: {
    model?: ModelStub | null;
    property?: string;
    readonly?: boolean;
    useDefaultMargin?: boolean;
  };
  Blocks: {
    default: [
      {
        checkbox: WithBoundArgs<typeof Checkbox, never>;
        datepicker: WithBoundArgs<typeof Datepicker, 'id' | 'errors'>;
        help: WithBoundArgs<typeof Help, never>;
        label: WithBoundArgs<typeof Label, 'for' | 'errors'>;
        readonly: WithBoundArgs<typeof UiTextbox, 'id' | 'readonly'>;
        textarea: WithBoundArgs<typeof UiTextarea, 'id' | 'errors' | 'readonly'>;
        textbox: WithBoundArgs<typeof UiTextbox, 'id' | 'errors' | 'readonly'>;
        validationErrors: WithBoundArgs<typeof ValidationErrors, 'errors'>;
      },
    ];
  };
}

export default class GroupComponent extends Component<GroupSignature> {
  uniqueId = `${guidFor(this)}-field`;

  get useDefaultMargin() {
    return valueOrDefault(this.args.useDefaultMargin, true);
  }

  get errors() {
    if (this.args.model && this.args.property) {
      const fieldErrors = this.args.model.errors?.find((error) => error.key === this.args.property);

      if (fieldErrors) {
        return fieldErrors.validation;
      }
    }

    return [];
  }

  <template>
    <div class={{if this.useDefaultMargin 'mb-6'}} ...attributes>
      {{yield
        (hash
          checkbox=(component Checkbox)
          datepicker=(component Datepicker id=this.uniqueId errors=this.errors)
          help=(component Help)
          label=(component Label for=this.uniqueId errors=this.errors)
          readonly=(component UiTextbox id=this.uniqueId readonly=true)
          textarea=(component UiTextarea id=this.uniqueId errors=this.errors readonly=@readonly)
          textbox=(component UiTextbox id=this.uniqueId errors=this.errors readonly=@readonly)
          validationErrors=(component ValidationErrors errors=this.errors)
        )
      }}
    </div>
  </template>
}
