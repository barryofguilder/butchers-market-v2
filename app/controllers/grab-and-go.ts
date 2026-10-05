import Controller from '@ember/controller';
import { cached } from '@glimmer/tracking';
import { format, formatISO } from 'date-fns';
import type GrabAndGo from '../models/grab-and-go';

export default class GrabAndGoController extends Controller {
  declare model: { holidayItems: GrabAndGo[]; regularItems: GrabAndGo[] };

  @cached
  get lastUpdatedOn() {
    const [latestItem] = [...this.model.regularItems, ...this.model.holidayItems].sort((a, b) => {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

    return latestItem ? formatISO(latestItem.updatedAt) : null;
  }

  get formattedDate() {
    return this.lastUpdatedOn ? format(this.lastUpdatedOn, 'EEEE, MMMM do, yyyy') : null;
  }
}
