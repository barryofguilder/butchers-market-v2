import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  itemClicked() {},

  media: service(),
  router: service(),

  isMobile: computed('media.{isLg,isXl}', function() {
    return !this.media.isLg && !this.media.isXl;
  }),
  isEventsPage: equal('router.currentRouteName', 'events'),
});
