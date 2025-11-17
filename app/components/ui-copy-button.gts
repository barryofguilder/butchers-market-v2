import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { restartableTask, timeout } from 'ember-concurrency';
// @ts-expect-error: There are no types for this.
import CopyButton from 'ember-cli-clipboard/components/copy-button';
// @ts-expect-error: There are no types for this.
import EmberTooltip from 'ember-tooltips/components/ember-tooltip';
import UiIcon from './ui-icon';

interface UiCopyButtonSignature {
  Element: HTMLDivElement;
  Args: {
    text: string | null;
  };
  Blocks: {
    default: [];
  };
}

export default class UiCopyButton extends Component<UiCopyButtonSignature> {
  @tracked showTooltip = false;

  onCopy = restartableTask(async () => {
    this.showTooltip = true;
    await timeout(2000);
    this.showTooltip = false;
  });

  <template>
    <CopyButton
      @text={{@text}}
      @onSuccess={{this.onCopy.perform}}
      title='copy to clipboard'
      class='px-2 py-1 rounded border hover:bg-gray-50 active:shadow'
    >
      <EmberTooltip @isShown={{this.showTooltip}} @event='none' @text='Copied!' />
      <UiIcon @icon='copy' />
      <span class='ml-1'>Copy</span>
    </CopyButton>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    UiCopyButton: typeof UiCopyButton;
  }
}
