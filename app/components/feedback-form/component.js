import Ember from 'ember';

export default Ember.Component.extend({
  ajax: Ember.inject.service(),

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
  showInvalidFormError: Ember.computed('nameInvalid', 'emailInvalid', 'messageInvalid', 'recaptchaInvalid', function() {
    return this.get('nameInvalid') ||
           this.get('emailInvalid') ||
           this.get('messageInvalid') ||
           this.get('recaptchaInvalid');
  }),

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
          recaptcha: this.get('recaptcha')
        }),
        contentType: 'application/json'
      };

      this.get('ajax').post('/server/feedback.php', payload).then(() => {
        this.setProperties({
          feedbackSent: true,
          nameInvalid: false,
          emailInvalid: false,
          messageInvalid: false,
          recaptchaInvalid: false,
          showServerError: false
        });
      }).catch((response) => {
        if (response && response.errors && response.errors.length > 0) {
          let error = response.errors[0];

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
    }
  }
});
