import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import config from 'butchers-market/config/environment';
import { task } from 'ember-concurrency';
import fetch from 'fetch';

export default class FeedbackForm extends Component {
  showReCaptcha = config.showReCaptcha;

  @tracked name;
  @tracked email;
  @tracked message;
  @tracked recaptcha;
  @tracked feedbackSent = false;
  @tracked nameInvalid = false;
  @tracked emailInvalid = false;
  @tracked messageInvalid = false;
  @tracked recaptchaInvalid = false;
  @tracked showServerError = false;

  get showInvalidFormError() {
    return this.nameInvalid || this.emailInvalid || this.messageInvalid || this.recaptchaInvalid;
  }

  @(task(function*() {
    let payload = {
      method: 'POST',
      body: JSON.stringify({
        name: this.name,
        email: this.email,
        message: this.message,
        recaptcha: this.recaptcha,
      }),
    };

    const response = yield fetch('/server/feedback.php', payload);
    const json = yield response.json();

    if (response.status >= 200 && response.status < 300) {
      this.feedbackSent = true;
      this.nameInvalid = false;
      this.emailInvalid = false;
      this.messageInvalid = false;
      this.recaptchaInvalid = false;
      this.showServerError = false;
    } else {
      if (json && json.errors && json.errors.length > 0) {
        let error = json.errors[0];

        if (error.detail.name) {
          this.nameInvalid = true;
        } else {
          this.nameInvalid = false;
        }

        if (error.detail.email) {
          this.emailInvalid = true;
        } else {
          this.emailInvalid = false;
        }

        if (error.detail.message) {
          this.messageInvalid = true;
        } else {
          this.messageInvalid = false;
        }

        if (error.detail.recaptcha) {
          this.recaptchaInvalid = true;
        } else {
          this.recaptchaInvalid = false;
        }
      } else {
        this.showServerError = true;
      }
    }
  }).drop())
  sendFeedbackTask;

  @action
  onCaptchaResolved(reCaptchaResponse) {
    this.recaptcha = reCaptchaResponse;
  }

  @action
  sendFeedback() {
    this.sendFeedbackTask.perform();
  }
}
