import Component from '@glimmer/component';
import type { WithBoundArgs } from '@glint/template';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { hash } from '@ember/helper';
import { task } from 'ember-concurrency';
import Group from './admin-form/group';
import Label from './admin-form/label';
import UiButton from '../ui-button';

interface AdminFormSignature {
  Element: HTMLFormElement;
  Args: {
    afterSubmit?: () => Promise<void>;
    onSubmit?: () => Promise<void>;
    readonly?: boolean;
  };
  Blocks: {
    default: [
      {
        group: WithBoundArgs<typeof Group, 'readonly'>;
        label: WithBoundArgs<typeof Label, never>;
        submit: WithBoundArgs<typeof UiButton, 'isRunning' | 'type' | 'variant'>;
      },
    ];
  };
}

export default class AdminFormComponent extends Component<AdminFormSignature> {
  submitTask = task(async () => {
    if (this.args.onSubmit) {
      await this.args.onSubmit();
    }

    if (this.args.afterSubmit) {
      await this.args.afterSubmit();
    }
  });

  @action
  submit(event: SubmitEvent) {
    event.preventDefault();
    this.submitTask.perform();
  }

  <template>
    <form class='m-0' {{on 'submit' this.submit}} ...attributes>
      {{yield
        (hash
          group=(component Group readonly=@readonly)
          label=(component Label)
          submit=(component
            UiButton
            data-test-id='submit-btn'
            isRunning=this.submitTask.isRunning
            type='submit'
            variant='primary'
          )
        )
      }}
    </form>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Admin::AdminForm': typeof AdminFormComponent;
  }
}
