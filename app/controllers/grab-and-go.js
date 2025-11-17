import Controller from '@ember/controller';
import { cached } from '@glimmer/tracking';
import { format, formatISO } from 'date-fns';

export default class GrabAndGoController extends Controller {
  @cached
  get lastUpdatedOn() {
    // We want to sort all items, not just today's items, because if an item was removed from
    // today's items, we want that time to show as the last updated time.
    const sortedItems = this.model
      .slice()
      .sort((a, b) => {
        return a.updatedAt - b.updatedAt;
      })
      .reverse();

    return sortedItems.length > 0 ? formatISO(sortedItems[0].updatedAt) : null;
  }

  get formattedDate() {
    return format(this.lastUpdatedOn, 'EEEE, MMMM do, yyyy');
  }
}
