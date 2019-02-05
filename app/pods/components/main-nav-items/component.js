import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  itemClicked() {},

  media: service(),
  router: service(),

  notDesktop: computed('media.{isSm,isMd}', function() {
    return this.media.isSm || this.media.isMd;
  }),
  isEventsPage: equal('router.currentRouteName', 'events'),
});
