import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import type Hour from '../../../models/hour';
import dateFormat from '../../../helpers/date-format';
import { getErrorMessageFromException } from '../../../utils/error-handling';
import ModalDialog from '../../modal-dialog';
import UiAlert from '../../ui-alert';
import UiButton from '../../ui-button';
import AdminForm from '../admin-form';

interface DeleteHoursFormSignature {
  Args: {
    isOpen: boolean;
    hours: Hour | null;
    onCancel: () => void;
    onSave: () => void;
  };
}

export default class DeleteHoursFormComponent extends Component<DeleteHoursFormSignature> {
  @tracked errorMessage: string | null = null;

  deleteHours = dropTask(async () => {
    try {
      await this.args.hours?.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = await getErrorMessageFromException(ex);
    }
  });

  <template>
    <ModalDialog @isOpen={{@isOpen}} @onClose={{@onCancel}} as |Modal|>
      <Modal.header>
        Delete Hours?
      </Modal.header>
      <AdminForm class='max-w-xl' @onSubmit={{this.deleteHours.perform}} as |Form|>
        <Modal.body>
          {{#if this.errorMessage}}
            <UiAlert data-test-id='server-error' @variant='danger'>
              {{this.errorMessage}}
            </UiAlert>
          {{/if}}

          <p class='mb-8'>
            Do you really want to delete these hours?
          </p>

          <Form.group data-test-id='type' as |Group|>
            <Group.label>Type</Group.label>
            <Group.readonly @value={{@hours.type}} />
          </Form.group>

          <Form.group data-test-id='label' as |Group|>
            <Group.label>Label</Group.label>
            <Group.readonly @value={{@hours.label}} />
          </Form.group>

          <Form.group data-test-id='label' as |Group|>
            <Group.label>Active Start Date</Group.label>
            <Group.readonly @value={{dateFormat @hours.activeStartDate 'LL/dd/yyyy'}} />
          </Form.group>

          <Form.group data-test-id='label' as |Group|>
            <Group.label>Active End Date</Group.label>
            <Group.readonly @value={{dateFormat @hours.activeEndDate 'LL/dd/yyyy'}} />
          </Form.group>

          <Form.group data-test-id='label' as |Group|>
            <Group.label>Lines</Group.label>
            <ul class='list-disc list-inside'>
              <li>{{@hours.line1}}</li>
              {{#if @hours.line2}}
                <li>{{@hours.line2}}</li>
              {{/if}}
              {{#if @hours.line3}}
                <li>{{@hours.line3}}</li>
              {{/if}}
            </ul>
          </Form.group>
        </Modal.body>
        <Modal.footer>
          <UiButton @variant='plain' @onClick={{@onCancel}}>
            No
          </UiButton>
          <Form.submit class='ml-2'>
            Yes
          </Form.submit>
        </Modal.footer>
      </AdminForm>
    </ModalDialog>
  </template>
}
