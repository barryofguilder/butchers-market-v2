import Component from '@glimmer/component';
import { action } from '@ember/object';
import { dropTask } from 'ember-concurrency';
import type DeliItem from '../../../models/deli-item';
import AdminForm from '../admin-form';

interface MiniFormSignature {
  Element: HTMLLIElement;
  Args: {
    item: DeliItem;
  };
}

export default class MiniFormComponent extends Component<MiniFormSignature> {
  saveItem = dropTask(async () => {
    await this.args.item.save();
  });

  @action
  handleOnChange(checked: boolean) {
    this.args.item.isHidden = checked;
    this.saveItem.perform();
  }

  <template>
    <AdminForm as |Form|>
      <Form.group data-test-id='is-hidden' @useDefaultMargin={{false}} as |Group|>
        <Group.checkbox
          @hideLabel={{true}}
          @checked={{@item.isHidden}}
          @onChange={{this.handleOnChange}}
        >
          Is Hidden?
        </Group.checkbox>
      </Form.group>
    </AdminForm>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Admin::DeliItems::MiniForm': typeof MiniFormComponent;
  }
}
