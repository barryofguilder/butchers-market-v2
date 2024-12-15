import Component from '@glimmer/component';
import type { WithBoundArgs } from '@glint/template';
import { guidFor } from '@ember/object/internals';
import { hash } from '@ember/helper';
import { get } from '@ember/object';
import { valueOrDefault } from '../../../utils/value-or-default';
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
    useDefaultMargin?: boolean;
  };
  Blocks: {
    default: [
      {
        datepicker: WithBoundArgs<typeof Datepicker, 'id' | 'errors'>;
        help: WithBoundArgs<typeof Help, never>;
        label: WithBoundArgs<typeof Label, 'for' | 'errors'>;
        readonly: WithBoundArgs<typeof UiTextbox, 'id' | 'readonly'>;
        textarea: WithBoundArgs<typeof UiTextarea, 'id' | 'errors'>;
        textbox: WithBoundArgs<typeof UiTextbox, 'id' | 'errors'>;
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
          datepicker=(component Datepicker id=this.uniqueId errors=this.errors)
          help=(component Help)
          label=(component Label for=this.uniqueId errors=this.errors)
          readonly=(component UiTextbox id=this.uniqueId readonly=true)
          textarea=(component UiTextarea id=this.uniqueId errors=this.errors)
          textbox=(component UiTextbox id=this.uniqueId errors=this.errors)
          validationErrors=(component ValidationErrors errors=this.errors)
        )
      }}
    </div>
  </template>
}
