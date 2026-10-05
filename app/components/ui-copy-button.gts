import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { restartableTask, timeout } from 'ember-concurrency';
import { Popover } from 'ember-primitives';
import clipboard from '../modifiers/clipboard';
import UiIcon from './ui-icon';

interface UiCopyButtonSignature {
  Element: HTMLButtonElement;
  Args: {
    text: string | null;
  };
  Blocks: {
    default: [];
  };
}

export default class UiCopyButton extends Component<UiCopyButtonSignature> {
  @tracked showTooltip = false;

  guid = guidFor(this);

  onCopy = restartableTask(async () => {
    this.showTooltip = true;
    await timeout(2000);
    this.showTooltip = false;
  });

  <template>
    <Popover @placement="top" @offsetOptions={{8}} @inline={{true}} as |p|>
      <button
        type="button"
        class="px-2 py-1 rounded-sm border hover:bg-gray-50 active:shadow-sm"
        data-clipboard-id={{this.guid}}
        ...attributes
        {{p.reference}}
        {{clipboard
          text=@text
          action="copy"
          delegateClickEvent=false
          onSuccess=this.onCopy.perform
        }}
      >
        <UiIcon @icon="copy" />
        <span class="ml-1">Copy</span>
      </button>
      {{#if this.showTooltip}}
        <p.Content role="status" class="z-10 px-2 py-1 rounded-sm bg-gray-800 text-sm text-white">
          Copied!
        </p.Content>
      {{/if}}
    </Popover>
  </template>
}
