import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import type { GrabAndGo } from '../../../schemas/grab-and-go';
import type Store from '../../../services/store';
import { saveRecord } from '../../../utils/records';
import AdminForm from '../admin-form';

interface MiniFormSignature {
  Element: HTMLLIElement;
  Args: {
    item: GrabAndGo;
    field: 'inStock' | 'isHoliday';
  };
}

export default class MiniFormComponent extends Component<MiniFormSignature> {
  @service declare store: Store;

  get isHoliday() {
    return this.args.field === 'isHoliday';
  }

  get isChecked() {
    const { item } = this.args;
    return this.isHoliday ? item.isHoliday : item.inStock;
  }

  saveItem = dropTask(async () => {
    await saveRecord(this.store, this.args.item);
  });

  @action
  handleOnChange(checked: boolean) {
    const { item } = this.args;

    if (this.isHoliday) {
      item.isHoliday = checked;
    } else {
      item.inStock = checked;
    }

    this.saveItem.perform();
  }

  <template>
    <AdminForm as |Form|>
      <Form.group
        data-test-id={{if this.isHoliday "is-holiday" "in-stock"}}
        @useDefaultMargin={{false}}
        as |Group|
      >
        <Group.checkbox
          @hideLabel={{true}}
          @checked={{this.isChecked}}
          @onChange={{this.handleOnChange}}
        >
          {{if this.isHoliday "Is Holiday?" "In Stock?"}}
        </Group.checkbox>
      </Form.group>
    </AdminForm>
  </template>
}
