import type { RouteTemplate } from '../utils/route-template';
import type DeliItem from '../models/deli-item';
import sortBy from '../helpers/sort-by';
import Container from '../components/container';
import HeaderTitle from '../components/header-title';
import MobileOrderBanner from '../components/mobile-order-banner';
import PromoSection from '../components/promo-section';

const DeliTemplate: RouteTemplate<DeliItem[]> = <template>
  <MobileOrderBanner />

  <PromoSection @image='promo-deli.jpg' as |Promo|>
    <Container>
      <div class='text-center lg:w-3/4 lg:text-left'>
        <Promo.title>
          Fresh Made Everything!
        </Promo.title>
        <Promo.subtitle>
          Everything in our deli is made in-house from scratch to achieve a quality and freshness
          like no other store can provide.
        </Promo.subtitle>
      </div>

      <div class='mt-16 md:mt-24'>
        <img class='w-40 mx-auto lg:mx-0' src='/images/serving-boars-head.png' alt='Boars Head' />
      </div>
    </Container>
  </PromoSection>

  <section>
    <HeaderTitle @title='Everyday Deli Items' />

    <Container>
      <div class='flex flex-wrap -mx-4'>
        {{#each (sortBy 'title' @model) as |item|}}
          <div class='mt-10 px-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4'>
            <img
              class='w-full shadow-md object-cover sm:w-[264px] sm:h-[202px] md:w-[208px] md:h-[159px] lg:w-[212px] lg:h-[162px] xl:w-[276px] xl:h-[211px] 2xl:w-[340px] 2xl:h-[260px]'
              src='{{item.imageUrlPath}}'
              alt={{item.title}}
            />
            <h4 class='mt-2 text-xl font-bold text-center text-gray-900'>{{item.title}}</h4>
          </div>
        {{/each}}
      </div>
    </Container>
  </section>
</template>;

export default DeliTemplate;
