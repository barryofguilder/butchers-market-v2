import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import fetch from 'fetch';
import baseUrl from 'butchers-market/utils/base-url';

export default class SignInFormComponent extends Component {
  email = '';
  password = '';

  @tracked hasError = false;

  @(task(function*() {
    let body = JSON.stringify({
      email: this.email,
      password: this.password,
    });
    let payload = {
      method: 'POST',
      body,
    };

    const response = yield fetch(`${baseUrl}/token`, payload);

    if (response.status === 201) {
      this.hasError = false;

      const token = yield response.text();
      this.args.onAuthenticated(token);
    } else {
      this.hasError = true;
    }
  }).drop())
  signIn;
}
