import Controller from '@ember/controller';
import { cached } from '@glimmer/tracking';
import { format, formatISO } from 'date-fns';

export default class GrabAndGoController extends Controller {
  @cached
  get lastUpdatedOn() {
    const sortedItems = [...this.model.regularItems, ...this.model.holidayItems]
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
