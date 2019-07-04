// NOTE: Taken from https://github.com/ragnarpeterson/ember-scroll-to

import Service from '@ember/service';
import { computed } from '@ember/object';
import { warn } from '@ember/debug';
import $ from 'jquery';

const DURATION = 750;
const EASING = 'swing';
const OFFSET = 0;

export default Service.extend({
  // ----- Static properties -----
  duration: DURATION,
  easing: EASING,
  offset: OFFSET,

  // ----- Computed properties -----
  scrollable: computed(function() {
    return $('html, body');
  }),

  // ----- Methods -----
  getJQueryElement(target) {
    const jQueryElement = $(target);

    if (!jQueryElement) {
      warn(`element couldn't be found:`, target);
      return;
    }

    return jQueryElement;
  },

  getScrollableTop() {
    // because the target elements top is calculated relative to the document,
    // and if the scrollable container is not the document,
    // we need to normalize the target elements top based on the top and current scrolled position of the scrollable
    if (this.scrollable.offset().top) {
      return this.scrollable.scrollTop() - this.scrollable.offset().top;
    } else {
      return 0;
    }
  },

  getVerticalCoord(target, offset = 0) {
    const jQueryElement = this.getJQueryElement(target);
    return this.getScrollableTop() + jQueryElement.offset().top + offset;
  },

  scrollVertical(target, opts = {}) {
    return new Promise((resolve, reject) => {
      this.scrollable
        .animate(
          {
            scrollTop: this.getVerticalCoord(target, opts.offset),
          },
          opts.duration || this.duration,
          opts.easing || this.easing,
          opts.complete
        )
        .promise()
        .then(resolve, reject);
    });
  },
});
