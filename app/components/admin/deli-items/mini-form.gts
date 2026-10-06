import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import type { DeliItem } from '../../../schemas/deli-item';
import type Store from '../../../services/store';
import { saveRecord } from '../../../utils/records';
import AdminForm from '../admin-form';

interface MiniFormSignature {
  Element: HTMLLIElement;
  Args: {
    item: DeliItem;
  };
}

export default class MiniFormComponent extends Component<MiniFormSignature> {
  @service declare store: Store;

  saveItem = dropTask(async () => {
    await saveRecord(this.store, this.args.item);
  });

  @action
  handleOnChange(checked: boolean) {
    this.args.item.isHidden = checked;
    this.saveItem.perform();
  }

  <template>
    <AdminForm as |Form|>
      <Form.group data-test-id="is-hidden" @useDefaultMargin={{false}} as |Group|>
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
