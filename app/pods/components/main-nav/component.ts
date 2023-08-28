import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Waiting on real types for this.
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import { type Sprite } from 'ember-animated';
import { EmptyObject } from '@ember/component/helper';

export interface MainNavSignature {
  Args: EmptyObject;
}

export default class MainNavComponent extends Component<MainNavSignature> {
  // TODO: Create types for `ember-responsive`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @service declare media: any;

  @tracked showNavigation = false;

  get isMobile() {
    return !this.media.isLg && !this.media.isXl;
  }

  *transition({
    insertedSprites,
    removedSprites,
  }: {
    insertedSprites: Sprite[];
    removedSprites: Sprite[];
  }) {
    for (const sprite of insertedSprites) {
      fadeIn(sprite);
    }
    for (const sprite of removedSprites) {
      fadeOut(sprite);
    }

    yield;
  }

  @action
  toggleNavigation() {
    this.showNavigation = !this.showNavigation;
  }
}
