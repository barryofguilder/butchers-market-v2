import Controller from '@ember/controller';
import { sort, notEmpty } from '@ember/object/computed';

export default Controller.extend({
  hoursSort: Object.freeze(['default:desc', 'type:desc', 'label:asc']),
  sortedHours: sort('model', 'hoursSort'),
  hoursToDelete: null,
  showDeleteModal: notEmpty('hoursToDelete'),
  errorMessage: null,

  actions: {
    delete(hours) {
      if (!hours.get('default')) {
        this.set('hoursToDelete', hours);
      }
    },

    deleteHours() {
      this.hoursToDelete
        .destroyRecord()
        .then(() => {
          this.set('hoursToDelete', null);
        })
        .catch(reason => {
          this.set('errorMessage', reason);
        });
    },
  },
});
