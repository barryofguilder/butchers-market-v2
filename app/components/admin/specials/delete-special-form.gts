import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import type Special from '../../../models/special';
import dateFormat from '../../../helpers/date-format';
import { getErrorMessageFromException } from '../../../utils/error-handling';
import ModalDialog from '../../modal-dialog';
import UiAlert from '../../ui-alert';
import UiButton from '../../ui-button';
import AdminForm from '../admin-form';

interface DeleteSpecialFormSignature {
  Args: {
    isOpen: boolean;
    special: Special | null;
    onCancel: () => void;
    onSave: () => void;
  };
}

export default class DeleteSpecialFormComponent extends Component<DeleteSpecialFormSignature> {
  @tracked errorMessage: string | null = null;

  deleteSpecial = dropTask(async () => {
    try {
      await this.args.special?.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = await getErrorMessageFromException(ex);
    }
  });

  <template>
    <ModalDialog @isOpen={{@isOpen}} @onClose={{@onCancel}} as |Modal|>
      <Modal.header>
        Delete Special?
      </Modal.header>
      <AdminForm class="max-w-xl" @onSubmit={{this.deleteSpecial.perform}} as |Form|>
        <Modal.body>
          {{#if this.errorMessage}}
            <UiAlert data-test-id="server-error" @variant="danger">
              {{this.errorMessage}}
            </UiAlert>
          {{/if}}

          <p class="mb-8">
            Do you really want to delete this special?
          </p>

          <Form.group data-test-id="title" as |Group|>
            <Group.label>Title</Group.label>
            <Group.readonly @value={{@special.title}} />
          </Form.group>

          {{#if @special.activeStartDate}}
            <Form.group data-test-id="start-date" as |Group|>
              <Group.label>Active Start Date</Group.label>
              <Group.readonly @value={{dateFormat @special.activeStartDate "LL/dd/yyyy"}} />
            </Form.group>

            <Form.group data-test-id="end-date" as |Group|>
              <Group.label>Active End Date</Group.label>
              <Group.readonly @value={{dateFormat @special.activeEndDate "LL/dd/yyyy"}} />
            </Form.group>
          {{/if}}
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
