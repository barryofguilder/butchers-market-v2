import Controller from '@ember/controller';
import MediaMixin from '../mixins/media-mixin';

export default Controller.extend(MediaMixin, {
  queryParams: ['events'],
  events: false
});
