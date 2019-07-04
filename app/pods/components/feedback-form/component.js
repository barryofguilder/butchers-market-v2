import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import config from 'butchers-market/config/environment';

export default Component.extend({
  ajax: service(),

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

  actions: {
    onCaptchaResolved(reCaptchaResponse) {
      this.set('recaptcha', reCaptchaResponse);
    },

    sendFeedback() {
      let payload = {
        data: JSON.stringify({
          name: this.get('name'),
          email: this.get('email'),
          message: this.get('message'),
          recaptcha: this.get('recaptcha'),
        }),
        contentType: 'application/json',
      };

      this.get('ajax')
        .post('/server/feedback.php', payload)
        .then(() => {
          this.setProperties({
            feedbackSent: true,
            nameInvalid: false,
            emailInvalid: false,
            messageInvalid: false,
            recaptchaInvalid: false,
            showServerError: false,
          });
        })
        .catch(response => {
          if (
            response &&
            response.payload &&
            response.payload.errors &&
            response.payload.errors.length > 0
          ) {
            let error = response.payload.errors[0];

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
        });
    },
  },
});
