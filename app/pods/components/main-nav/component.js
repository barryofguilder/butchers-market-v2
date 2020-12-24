import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';

export default class MainNavComponent extends Component {
  @service media;

  @tracked showNavigation = false;

  get isMobile() {
    return !this.media.isLg && !this.media.isXl;
  }

  /* eslint-disable-next-line */
  *transition({ insertedSprites, removedSprites }) {
    for (let sprite of insertedSprites) {
      fadeIn(sprite);
    }
    for (let sprite of removedSprites) {
      fadeOut(sprite);
    }
  }

  @action
  toggleNavigation() {
    this.showNavigation = !this.showNavigation;
  }
}
