import Component from '@ember/component';
import RunMixin from 'ember-lifeline/mixins/run';

export default Component.extend(RunMixin, {
  date: null,

  _date: null,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,

  init() {
    this._super(...arguments);

    this.set('_date', this.get('date').getTime());
    this.updateTime();
  },

  updateTime() {
    let now = new Date().getTime();
    let distance = this.get('_date') - now;

    this.setProperties({
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    });

    this.runTask(() => this.updateTime(), 1000);
  },
});
