import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { dropTask } from 'ember-concurrency';
import fetch from 'fetch';
import config from 'butchers-market/config/environment';
import baseUrl from '../utils/base-url';

export default class FeedbackFormComponent extends Component {
  showReCaptcha = config.showReCaptcha;

  @tracked name;
  @tracked email;
  @tracked message;
  @tracked recaptcha;
  @tracked formState;

  get feedbackSent() {
    return this.formState === 'Sent';
  }

  get showInvalidFormError() {
    return this.formState === 'FormError';
  }

  get showServerError() {
    return this.formState === 'ServerError';
  }

  sendFeedbackTask = dropTask(async () => {
    let body = JSON.stringify({
      data: {
        attributes: {
          name: this.name,
          email: this.email,
          message: this.message,
          recaptchaToken: this.recaptcha,
        },
      },
    });
    let payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
      },
      body,
    };

    const response = await fetch(`${baseUrl}/feedback`, payload);

    if (response.status === 204) {
      this.formState = 'Sent';
    } else if (response.status === 422) {
      // TODO: Actually highlight the fields that have errors.
      this.formState = 'FormError';
    } else {
      this.formState = 'ServerError';
    }
  });

  @action
  onCaptchaResolved(reCaptchaResponse) {
    this.recaptcha = reCaptchaResponse;
  }

  @action
  sendFeedback(event) {
    event.preventDefault();
    this.sendFeedbackTask.perform();
  }
}
