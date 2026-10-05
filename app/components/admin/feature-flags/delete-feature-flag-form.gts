import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import type FeatureFlag from '../../../models/feature-flag';
import { getErrorMessageFromException } from '../../../utils/error-handling';
import ModalDialog from '../../modal-dialog';
import UiAlert from '../../ui-alert';
import UiButton from '../../ui-button';
import AdminForm from '../admin-form';

interface DeleteFeatureFlagFormSignature {
  Args: {
    isOpen: boolean;
    flag: FeatureFlag | null;
    onCancel: () => void;
    onSave: () => void;
  };
}

export default class DeleteFeatureFlagFormComponent extends Component<DeleteFeatureFlagFormSignature> {
  @tracked errorMessage: string | null = null;

  deleteFlag = dropTask(async () => {
    try {
      await this.args.flag?.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = await getErrorMessageFromException(ex);
    }
  });

  <template>
    <ModalDialog @isOpen={{@isOpen}} @onClose={{@onCancel}} as |Modal|>
      <Modal.header>
        Delete Feature Flag?
      </Modal.header>
      <AdminForm class="max-w-xl" @onSubmit={{this.deleteFlag.perform}} as |Form|>
        <Modal.body>
          {{#if this.errorMessage}}
            <UiAlert data-test-id="server-error" @variant="danger">
              {{this.errorMessage}}
            </UiAlert>
          {{/if}}

          <p class="mb-8">
            Do you really want to delete this feature flag?
          </p>

          <Form.group data-test-id="title" as |Group|>
            <Group.label>Name</Group.label>
            <Group.readonly @value={{@flag.name}} />
          </Form.group>

          <Form.group data-test-id="hidden" as |Group|>
            <Group.label>Is Active?</Group.label>
            <Group.readonly @value={{if @flag.active "Yes" "No"}} />
          </Form.group>
        </Modal.body>
        <Modal.footer>
          <UiButton @variant="plain" @onClick={{@onCancel}}>
            No
          </UiButton>
          <Form.submit class="ml-2" @disabled={{this.deleteFlag.isRunning}}>
            Yes
          </Form.submit>
        </Modal.footer>
      </AdminForm>
    </ModalDialog>
  </template>
}
