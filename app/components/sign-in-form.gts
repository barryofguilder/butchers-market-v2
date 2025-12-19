import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import set from 'ember-set-helper/helpers/set';
import baseUrl from '../utils/base-url';
import AdminForm from './admin/admin-form';
import UiAlert from './ui-alert';

interface SignInFormSignature {
  Args: {
    onAuthenticated: (token: string) => void;
  };
}

export default class SignInFormComponent extends Component<SignInFormSignature> {
  @tracked username = '';
  @tracked password = '';
  @tracked hasError = false;

  signIn = dropTask(async () => {
    const body = JSON.stringify({
      data: {
        type: 'tokens',
        attributes: {
          username: this.username,
          password: this.password,
        },
      },
    });
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body,
    };

    const response = await fetch(`${baseUrl}/token`, payload);

    if (response.status === 201) {
      this.hasError = false;

      const token = await response.text();
      this.args.onAuthenticated(token);
    } else {
      this.hasError = true;
    }
  });

  <template>
    <AdminForm class='max-w-md' @onSubmit={{this.signIn.perform}} as |Form|>
      {{#if this.hasError}}
        <UiAlert data-test-id='server-error' @variant='danger'>
          Invalid username or password.
        </UiAlert>
      {{/if}}

      <Form.group data-test-id='username' as |Group|>
        <Group.label>Username</Group.label>
        <Group.textbox
          autocomplete='username'
          @value={{this.username}}
          @onChange={{set this 'username'}}
        />
      </Form.group>

      <Form.group data-test-id='password' as |Group|>
        <Group.label>Password</Group.label>
        <Group.textbox
          type='password'
          autocomplete='current-password'
          @value={{this.password}}
          @onChange={{set this 'password'}}
        />
      </Form.group>

      <div class='mt-8'>
        <Form.submit>
          Sign In
        </Form.submit>
      </div>
    </AdminForm>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    SignInForm: typeof SignInFormComponent;
  }
}
