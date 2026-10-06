import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { format, formatISO } from 'date-fns';
import type { GrabAndGo } from '../schemas/grab-and-go';
import Container from '../components/container';
import GrabAndGoList from '../components/grab-and-go-list';
import HeaderTitle from '../components/header-title';
import MobileOrderBanner from '../components/mobile-order-banner';

interface GrabAndGoModel {
  holidayItems: GrabAndGo[];
  regularItems: GrabAndGo[];
}

interface Signature {
  Args: {
    model: GrabAndGoModel;
  };
}

export default class GrabAndGoTemplate extends Component<Signature> {
  @cached
  get lastUpdatedOn() {
    const { holidayItems, regularItems } = this.args.model;
    const [latestItem] = [...regularItems, ...holidayItems].sort((a, b) => {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

    return latestItem ? formatISO(latestItem.updatedAt) : null;
  }

  get formattedDate() {
    return this.lastUpdatedOn ? format(this.lastUpdatedOn, 'EEEE, MMMM do, yyyy') : null;
  }

  <template>
    <MobileOrderBanner />

    {{! We need 1px of padding so that the header margin takes over since we have no promo image. }}
    <div class="pt-px"></div>

    {{#if @model.holidayItems.length}}
      <section>
        <HeaderTitle @title="Holiday Grab & Go Items" />

        <Container>
          <GrabAndGoList @items={{@model.holidayItems}} />
        </Container>
      </section>
    {{/if}}

    <section>
      <HeaderTitle @title="Today's Grab & Go Items" />

      <Container>
        <div class="mt-10 max-w-3xl mx-auto">
          <p class="text-center text-lg sm:text-2xl">
            Here are today's grab &amp; go items.
            {{#if this.lastUpdatedOn}}
              Last updated on
              <time datetime={{this.lastUpdatedOn}}>{{this.formattedDate}}</time>.
            {{/if}}
          </p>
        </div>

        <GrabAndGoList @items={{@model.regularItems}} />
      </Container>
    </section>
  </template>
}
