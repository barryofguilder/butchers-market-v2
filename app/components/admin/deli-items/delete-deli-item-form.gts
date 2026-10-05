import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import type { DeliItem } from '../../../schemas/deli-item';
import type Store from '../../../services/store';
import { getErrorMessageFromException } from '../../../utils/error-handling';
import { destroyRecord } from '../../../utils/records';
import ModalDialog from '../../modal-dialog';
import UiAlert from '../../ui-alert';
import UiButton from '../../ui-button';
import AdminForm from '../admin-form';

interface DeleteDeliItemFormSignature {
  Args: {
    isOpen: boolean;
    item: DeliItem | null;
    onCancel: () => void;
    onSave: () => void;
  };
}

export default class DeleteDeliItemFormComponent extends Component<DeleteDeliItemFormSignature> {
  @service declare store: Store;

  @tracked errorMessage: string | null = null;

  deleteItem = dropTask(async () => {
    try {
      if (this.args.item) {
        await destroyRecord(this.store, this.args.item);
      }
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = await getErrorMessageFromException(ex);
    }
  });

  <template>
    <ModalDialog @isOpen={{@isOpen}} @onClose={{@onCancel}} as |Modal|>
      <Modal.header>
        Delete Deli Item?
      </Modal.header>
      <AdminForm class="max-w-xl" @onSubmit={{this.deleteItem.perform}} as |Form|>
        <Modal.body>
          {{#if this.errorMessage}}
            <UiAlert data-test-id="server-error" @variant="danger">
              {{this.errorMessage}}
            </UiAlert>
          {{/if}}

          <p class="mb-8">
            Do you really want to delete this deli item?
          </p>

          <Form.group data-test-id="title" as |Group|>
            <Group.label>Title</Group.label>
            <Group.readonly @value={{@item.title}} />
          </Form.group>

          <Form.group data-test-id="lead-in" as |Group|>
            <Group.label>Ingredients</Group.label>
            <Group.textarea readonly={{true}} @value={{@item.ingredients}} />
          </Form.group>

          <Form.group data-test-id="hidden" as |Group|>
            <Group.label>Is Hidden?</Group.label>
            <Group.readonly @value={{if @item.isHidden "Yes" "No"}} />
          </Form.group>
        </Modal.body>
        <Modal.footer>
          <UiButton @variant="plain" @onClick={{@onCancel}}>
            No
          </UiButton>
          <Form.submit class="ml-2" @disabled={{this.deleteItem.isRunning}}>
            Yes
          </Form.submit>
        </Modal.footer>
      </AdminForm>
    </ModalDialog>
  </template>
}
