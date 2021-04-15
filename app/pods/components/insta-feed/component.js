import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import InstagramFeed from 'instafeed';
import config from 'butchers-market/config/environment';

const NUMBER_OF_PHOTOS = 8;

export default class InstaFeedComponent extends Component {
  @tracked photos;
  @tracked callCount = 0;

  get useFakeFeed() {
    // Return `false` if you want to use the real feed in development mode.
    return config.environment !== 'production';
  }

  constructor() {
    super(...arguments);

    if (this.useFakeFeed) {
      // Setup a fake Instagram feed so we don't hit the internet.
      const photos = [...new Array(12)].map(() => {
        return {
          url: 'images/meat-cheese-platter.jpg',
          alt: 'Cheese platter',
          caption: 'We have cheese platters!',
        };
      });
      this.photos = photos.slice(0, NUMBER_OF_PHOTOS);
    } else {
      this.setupInstaFeed();
    }
  }

  setupInstaFeed() {
    const urlNumber = config.environment === 'production' ? Math.random() * 3333 : 1932;

    new InstagramFeed({
      host: `https://images${urlNumber}-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=https://www.instagram.com/`,
      username: 'thebutchersmarket',
      callback: this.instagramFeed.bind(this),
    });
  }

  instagramFeed(data) {
    // For some reason, this was getting called twice.
    if (this.callCount > 0) {
      return;
    }

    if (data.edge_owner_to_timeline_media?.edges?.length > 0) {
      const photos = data.edge_owner_to_timeline_media?.edges.map((node) => {
        return this.processPhoto(node.node);
      });
      this.photos = photos.slice(0, NUMBER_OF_PHOTOS);

      this.callCount++;
    }
  }

  processPhoto(node) {
    const caption =
      node?.edge_media_to_caption?.edges?.length > 0
        ? node.edge_media_to_caption.edges[0].node.text
        : null;
    return {
      url: node.thumbnail_src,
      alt: node.accessibility_caption,
      caption,
    };
  }
}
