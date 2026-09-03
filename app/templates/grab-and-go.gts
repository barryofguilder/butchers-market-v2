import type { RouteTemplate } from '../utils/route-template';
import type GrabAndGoController from '../controllers/grab-and-go';
import type GrabAndGo from '../models/grab-and-go';
import Container from '../components/container';
import GrabAndGoList from '../components/grab-and-go-list';
import HeaderTitle from '../components/header-title';
import MobileOrderBanner from '../components/mobile-order-banner';

interface GrabAndGoModel {
  holidayItems: GrabAndGo[];
  regularItems: GrabAndGo[];
}

const GrabAndGoTemplate: RouteTemplate<GrabAndGoModel, GrabAndGoController> = <template>
  <MobileOrderBanner />

  {{! We need 1px of padding so that the header margin takes over since we have no promo image. }}
  <div class='pt-px'></div>

  {{#if @model.holidayItems.length}}
    <section>
      <HeaderTitle @title='Holiday Grab & Go Items' />

      <Container>
        <GrabAndGoList @items={{@model.holidayItems}} />
      </Container>
    </section>
  {{/if}}

  <section>
    <HeaderTitle @title="Today's Grab & Go Items" />

    <Container>
      <div class='mt-10 max-w-3xl mx-auto'>
        <p class='text-center text-lg sm:text-2xl'>
          Here are today's grab &amp; go items.
          {{#if @controller.lastUpdatedOn}}
            Last updated on
            <time datetime={{@controller.lastUpdatedOn}}>{{@controller.formattedDate}}</time>.
          {{/if}}
        </p>
      </div>

      <GrabAndGoList @items={{@model.regularItems}} />
    </Container>
  </section>
</template>;

export default GrabAndGoTemplate;
