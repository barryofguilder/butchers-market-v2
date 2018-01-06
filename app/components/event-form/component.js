import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  event: null,
  title: null,
  leadIn: null,
  startTime: null,
  endTime: null,
  link: null,
  errorMessage: null,
  dialogTitle: computed('event.isNew', function() {
    let isNew = this.get('event.isNew');

    return isNew ? 'New Event' : 'Edit Event';
  }),

  isValid: computed('title', 'startTime', 'endTime', function() {
    return isPresent(this.get('title')) &&
           isPresent(this.get('startTime')) &&
           isPresent(this.get('endTime'));
  }),

  init() {
    this._super(...arguments);

    let event = this.get('event');

    this.setProperties({
      title: event.get('title'),
      leadIn: event.get('leadIn'),
      link: event.get('link')
    });

    if (event.get('isNew')) {
      let now = new Date();

      this.setProperties({
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22)
      });
    } else {
      this.setProperties({
        startTime: event.get('startTime'),
        endTime: event.get('endTime')
      });
    }
  },

  actions: {
    save() {
      if (this.get('isValid')) {
        this.set('errorMessage', null);

        let event = this.get('event');
        event.setProperties({
          title: this.get('title'),
          leadIn: this.get('leadIn'),
          startTime: this.get('startTime'),
          endTime: this.get('endTime'),
          link: this.get('link')
        });

        event.save().then(() => {
          this.sendAction('saved');
        }).catch((reason) => {
          this.set('errorMessage', reason);
        });
      } else {
        this.set('errorMessage', 'You must fill out all the required fields');
      }
    },

    close() {
      this.sendAction('cancelled');
    }
  }
});
