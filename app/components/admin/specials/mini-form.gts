import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import type { Special } from '../../../schemas/special';
import type Store from '../../../services/store';
import { saveRecord } from '../../../utils/records';
import AdminForm from '../admin-form';

interface MiniFormSignature {
  Element: HTMLLIElement;
  Args: {
    special: Special;
  };
}

export default class MiniFormComponent extends Component<MiniFormSignature> {
  @service declare store: Store;

  saveSpecial = dropTask(async () => {
    await saveRecord(this.store, this.args.special);
  });

  @action
  handleOnChange(checked: boolean) {
    this.args.special.inStock = checked;
    this.saveSpecial.perform();
  }

  <template>
    <AdminForm as |Form|>
      <Form.group data-test-id="in-stock" @useDefaultMargin={{false}} as |Group|>
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
