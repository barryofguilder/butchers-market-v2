import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import ResetScrollMixin from '../mixins/reset-scroll-mixin';

export default Route.extend(ResetScrollMixin, {
  model() {
    return RSVP.hash({
      bundles: this.store.findAll('meat-bundle'),
      products: this.store.findAll('meat-product'),
      reviews: this.store.findAll('review')
    });
  }
});
