import Component from '@ember/component';
import { computed } from '@ember/object';
import config from 'butchers-market/config/environment';
import { task } from 'ember-concurrency';
import fetch from 'fetch';

export default Component.extend({
  tagName: '',

  showReCaptcha: config.showReCaptcha,
  name: null,
  email: null,
  message: null,
  recaptcha: null,
  feedbackSent: false,
  nameInvalid: false,
  emailInvalid: false,
  messageInvalid: false,
  recaptchaInvalid: false,
  showServerError: false,
  showInvalidFormError: computed(
    'nameInvalid',
    'emailInvalid',
    'messageInvalid',
    'recaptchaInvalid',
    function() {
      return (
        this.get('nameInvalid') ||
        this.get('emailInvalid') ||
        this.get('messageInvalid') ||
        this.get('recaptchaInvalid')
      );
    }
  ),

  sendFeedbackTask: task(function*() {
    let payload = {
      method: 'POST',
      body: JSON.stringify({
        name: this.get('name'),
        email: this.get('email'),
        message: this.get('message'),
        recaptcha: this.get('recaptcha'),
      }),
    };

    const response = yield fetch('/server/feedback.php', payload);
    const json = yield response.json();

    if (response.status >= 200 && response.status < 300) {
      this.setProperties({
        feedbackSent: true,
        nameInvalid: false,
        emailInvalid: false,
        messageInvalid: false,
        recaptchaInvalid: false,
        showServerError: false,
      });
    } else {
      if (json && json.errors && json.errors.length > 0) {
        let error = json.errors[0];

        if (error.detail.name) {
          this.set('nameInvalid', true);
        } else {
          this.set('nameInvalid', false);
        }

        if (error.detail.email) {
          this.set('emailInvalid', true);
        } else {
          this.set('emailInvalid', false);
        }

        if (error.detail.message) {
          this.set('messageInvalid', true);
        } else {
          this.set('messageInvalid', false);
        }

        if (error.detail.recaptcha) {
          this.set('recaptchaInvalid', true);
        } else {
          this.set('recaptchaInvalid', false);
        }
      } else {
        this.set('showServerError', true);
      }
    }
  }).drop(),

  actions: {
    onCaptchaResolved(reCaptchaResponse) {
      this.set('recaptcha', reCaptchaResponse);
    },

    sendFeedback() {
      this.sendFeedbackTask.perform();
    },
  },
});
