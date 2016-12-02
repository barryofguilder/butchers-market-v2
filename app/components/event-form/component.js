import Ember from 'ember';

export default Ember.Component.extend({
  event: null,
  title: null,
  leadIn: null,
  startTime: null,
  endTime: null,
  link: null,
  errorMessage: null,
  dialogTitle: Ember.computed('event.isNew', function() {
    let isNew = this.get('event.isNew');

    return isNew ? 'New Event' : 'Edit Event';
  }),

  isValid: Ember.computed('title', 'startTime', 'endTime', function() {
    return Ember.isPresent(this.get('title')) &&
           Ember.isPresent(this.get('startTime')) &&
           Ember.isPresent(this.get('endTime'));
  }),

  init() {
    this._super(...arguments);

    let event = this.get('event');

    this.setProperties({
      title: event.get('title'),
      leadIn: event.get('leadIn'),
      startTime: event.get('startTime'),
      endTime: event.get('endTime'),
      link: event.get('link')
    });
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
