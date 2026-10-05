import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import type MeatBundle from '../../../models/meat-bundle';
import { getErrorMessageFromException } from '../../../utils/error-handling';
import ModalDialog from '../../modal-dialog';
import UiAlert from '../../ui-alert';
import UiButton from '../../ui-button';
import AdminForm from '../admin-form';

interface DeleteMeatBundleFormSignature {
  Args: {
    isOpen: boolean;
    bundle: MeatBundle | null;
    onCancel: () => void;
    onSave: () => void;
  };
}

export default class DeleteMeatBundleFormComponent extends Component<DeleteMeatBundleFormSignature> {
  @tracked errorMessage: string | null = null;

  deleteBundle = dropTask(async () => {
    try {
      await this.args.bundle?.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = await getErrorMessageFromException(ex);
    }
  });

  <template>
    <ModalDialog @isOpen={{@isOpen}} @onClose={{@onCancel}} as |Modal|>
      <Modal.header>
        Delete Meat Bundle?
      </Modal.header>
      <AdminForm class="max-w-xl" @onSubmit={{this.deleteBundle.perform}} as |Form|>
        <Modal.body>
          {{#if this.errorMessage}}
            <UiAlert data-test-id="server-error" @variant="danger">
              {{this.errorMessage}}
            </UiAlert>
          {{/if}}

          <p class="mb-8">
            Do you really want to delete this meat bundle?
          </p>

          <Form.group data-test-id="title" as |Group|>
            <Group.label>Title</Group.label>
            <Group.readonly @value={{@bundle.title}} />
          </Form.group>

          <Form.group data-test-id="price" as |Group|>
            <Group.label>Price</Group.label>
            <Group.readonly @value={{@bundle.price}} />
          </Form.group>

          <Form.group data-test-id="items" as |Group|>
            <Group.label>Items</Group.label>
            {{@bundle.items.length}}
            Items
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
