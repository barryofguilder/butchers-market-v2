import Component from '@glimmer/component';
import { action } from '@ember/object';
import type { EmptyObject } from '@ember/component/helper';
import { dropTask } from 'ember-concurrency';
import type GrabAndGo from '../../../models/grab-and-go';
import AdminForm from '../admin-form';

interface MiniFormSignature {
  Element: HTMLLIElement;
  Args: {
    item: GrabAndGo;
  };
  Blocks: EmptyObject;
}

export default class MiniFormComponent extends Component<MiniFormSignature> {
  saveItem = dropTask(async () => {
    await this.args.item.save();
  });

  @action
  handleOnChange(checked: boolean) {
    this.args.item.inStock = checked;
    this.saveItem.perform();
  }

  <template>
    <AdminForm as |Form|>
      <Form.group data-test-id='in-stock' @useDefaultMargin={{false}} as |Group|>
        <Group.checkbox
          @hideLabel={{true}}
          @checked={{@item.inStock}}
          @onChange={{this.handleOnChange}}
        >
          In Stock?
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
