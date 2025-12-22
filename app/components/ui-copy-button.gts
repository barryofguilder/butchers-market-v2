import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { restartableTask, timeout } from 'ember-concurrency';
import clipboard from '../modifiers/clipboard';
// @ts-expect-error: There are no types for this.
import EmberTooltip from 'ember-tooltips/components/ember-tooltip';
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
    <button
      type='button'
      class='px-2 py-1 rounded border hover:bg-gray-50 active:shadow'
      data-clipboard-id={{this.guid}}
      ...attributes
      {{clipboard text=@text action='copy' delegateClickEvent=false onSuccess=this.onCopy.perform}}
    >
      <EmberTooltip @isShown={{this.showTooltip}} @event='none' @text='Copied!' />
      <UiIcon @icon='copy' />
      <span class='ml-1'>Copy</span>
    </button>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    UiCopyButton: typeof UiCopyButton;
  }
}
