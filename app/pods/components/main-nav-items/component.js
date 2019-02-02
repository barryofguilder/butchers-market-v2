import Component from '@ember/component';
import { equal, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  itemClicked() {},

  media: service(),
  router: service(),

  notDesktop: not('media.isLg'),
  isEventsPage: equal('router.currentRouteName', 'events'),
});
