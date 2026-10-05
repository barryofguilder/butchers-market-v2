import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import type { GrabAndGo } from '../../../schemas/grab-and-go';
import type Store from '../../../services/store';
import { getErrorMessageFromException } from '../../../utils/error-handling';
import { destroyRecord } from '../../../utils/records';
import ModalDialog from '../../modal-dialog';
import UiAlert from '../../ui-alert';
import UiButton from '../../ui-button';
import AdminForm from '../admin-form';

interface DeleteItemFormSignature {
  Args: {
    isOpen: boolean;
    item: GrabAndGo | null;
    onCancel: () => void;
    onSave: () => void;
  };
}

export default class DeleteItemFormComponent extends Component<DeleteItemFormSignature> {
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
        Delete Grab and Go Item?
      </Modal.header>
      <AdminForm class="max-w-xl" @onSubmit={{this.deleteItem.perform}} as |Form|>
        <Modal.body>
          {{#if this.errorMessage}}
            <UiAlert data-test-id="server-error" @variant="danger">
              {{this.errorMessage}}
            </UiAlert>
          {{/if}}

          <p class="mb-8">
            Do you really want to delete this grab and go item?
          </p>

          <Form.group data-test-id="title" as |Group|>
            <Group.label>Title</Group.label>
            <Group.readonly @value={{@item.title}} />
          </Form.group>

          <Form.group data-test-id="description" as |Group|>
            <Group.label>Description</Group.label>
            <Group.readonly @value={{@item.description}} />
          </Form.group>

          <Form.group data-test-id="in-stock" as |Group|>
            <Group.label>In Stock?</Group.label>
            <Group.readonly @value={{if @item.inStock "Yes" "No"}} />
          </Form.group>
        </Modal.body>
        <Modal.footer>
          <UiButton @variant="plain" @onClick={{@onCancel}}>
            No
          </UiButton>
          <Form.submit class="ml-2">
            Yes
          </Form.submit>
        </Modal.footer>
      </AdminForm>
    </ModalDialog>
  </template>
}
