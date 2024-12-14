import Component from '@glimmer/component';
import { action } from '@ember/object';
import { dropTask } from 'ember-concurrency';
import type GrabAndGo from '../../../models/grab-and-go';
import AdminForm from '../admin-form';

interface MiniFormSignature {
  Element: HTMLLIElement;
  Args: {
    item: GrabAndGo;
  };
  Blocks: {
    default: [];
    content: [];
  };
}

export default class MiniFormComponent extends Component<MiniFormSignature> {
  saveItem = dropTask(async () => {
    await this.args.item.save();
  });

  @action
  handleOnChange(checked: boolean) {
    this.args.item.isSoldOut = checked;
    this.saveItem.perform();
  }

  <template>
    <AdminForm class='max-w-xl' as |Form|>
      <Form.group data-test-id='sold-out' as |Group|>
        <Group.checkbox @checked={{@item.isSoldOut}} @onChange={{this.handleOnChange}}>
          Is Sold Out?
        </Group.checkbox>
      </Form.group>
    </AdminForm>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Admin::GrabAndGo::MiniForm': typeof MiniFormComponent;
  }
}
