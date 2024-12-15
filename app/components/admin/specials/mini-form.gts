import Component from '@glimmer/component';
import { action } from '@ember/object';
import type { EmptyObject } from '@ember/component/helper';
import { dropTask } from 'ember-concurrency';
import type Special from '../../../models/special';
import AdminForm from '../admin-form';

interface MiniFormSignature {
  Element: HTMLLIElement;
  Args: {
    special: Special;
  };
  Blocks: EmptyObject;
}

export default class MiniFormComponent extends Component<MiniFormSignature> {
  saveSpecial = dropTask(async () => {
    await this.args.special.save();
  });

  @action
  handleOnChange(checked: boolean) {
    this.args.special.inStock = checked;
    this.saveSpecial.perform();
  }

  <template>
    <AdminForm as |Form|>
      <Form.group data-test-id='in-stock' @useDefaultMargin={{false}} as |Group|>
        <Group.checkbox
          @hideLabel={{true}}
          @checked={{@special.inStock}}
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
    'Admin::Specials::MiniForm': typeof MiniFormComponent;
  }
}
