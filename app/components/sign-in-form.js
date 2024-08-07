import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import fetch from 'fetch';
import baseUrl from '../utils/base-url';

export default class SignInFormComponent extends Component {
  username = '';
  password = '';

  @tracked hasError = false;

  signIn = dropTask(async () => {
    let body = JSON.stringify({
      data: {
        type: 'tokens',
        attributes: {
          username: this.username,
          password: this.password,
        },
      },
    });
    let payload = {
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
}
