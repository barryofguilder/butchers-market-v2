import { eq } from 'ember-truth-helpers';
import type { RouteTemplate } from '../utils/route-template';
import type MeatController from '../controllers/meat';
import type MeatBundle from '../models/meat-bundle';
import type PackageBundle from '../models/package-bundle';
import sortBy from '../helpers/sort-by';
import splitIn from '../helpers/split-in';
import scrollTo from '../modifiers/scroll-to';
import Container from '../components/container';
import HeaderTitle from '../components/header-title';
import MeatProductsProvider from '../components/meat-products-provider';
import MobileOrderBanner from '../components/mobile-order-banner';
import ProductsList from '../components/products-list';
import PromoSection from '../components/promo-section';
import UiButton from '../components/ui-button';

interface MeatModel {
  bundles: MeatBundle[];
  packageBundles: PackageBundle[];
}

const MeatTemplate: RouteTemplate<MeatModel, MeatController> = <template>
  <MobileOrderBanner />

  <PromoSection @image='promo-meat.jpg' as |Promo|>
    <Container>
      <div class='text-center lg:w-3/4 lg:text-left'>
        <Promo.title>
          Fresh Cut Everything!
        </Promo.title>
        <Promo.subtitle>
          We hand cut all of our meats in-house and stock only products that satisfy our strict
          quality standards.
        </Promo.subtitle>
      </div>

      <div class='mt-16 sm:mt-24 max-w-4xl mx-auto'>
        <div class='sm:-mx-4 sm:flex'>
          <MeatProductsProvider as |provider|>
            {{#each provider.products as |product|}}
              <div
                class='mt-8 w-full sm:mt-0 sm:w-1/3 sm:px-4
                  {{if product.featured "sm:-pt-10" "sm:pt-10"}}'
              >
                <div>
                  <h4
                    class='text-xl sm:text-2xl uppercase tracking-wide font-black text-center bg-black text-yellow-700
                      {{if
                        product.featured
                        "px-6 py-3 sm:px-8 sm:py-4 text-2xl"
                        "px-3 py-2 sm:px-4"
                      }}'
                  >
                    {{product.title}}
                  </h4>
                  <ul class='natural-products-items'>
                    {{#each product.items as |item|}}
                      <li class='mt-1 p-3 sm:p-4 bg-white/30 text-center sm:text-lg'>
                        {{item}}
                      </li>
                    {{/each}}
                  </ul>
                </div>
              </div>
            {{/each}}
          </MeatProductsProvider>
        </div>
      </div>
    </Container>
  </PromoSection>

  <section {{scrollTo @controller.packages}}>
    <HeaderTitle @title='Bundle Packs' />

    <Container>
      {{#if @controller.meatBundlePDF}}
        <div class='mt-8 text-center'>
          <UiButton @href={{@controller.meatBundlePDF}}>
            Print Flyer
          </UiButton>
        </div>
      {{/if}}

      <ProductsList @products={{@model.bundles}} />
    </Container>
  </section>

  {{#each (sortBy 'displayOrder' @model.packageBundles) as |bundle|}}
    {{! Hiding "Ice Box" for now, might delete later if not needed anymore. }}
    {{#unless (eq bundle.title "Ice Box Mix N' Match")}}
      <section>
        <HeaderTitle @title={{bundle.title}} />

        <Container>
          {{#if bundle.fileUrlPath}}
            <div class='mt-8 text-center'>
              <UiButton @href={{bundle.fileUrlPath}}>
                Print Flyer
              </UiButton>
            </div>
          {{/if}}

          <div class='mt-12 sm:flex sm:flex-wrap'>
            <div class='text-lg font-black md:text-2xl sm:w-full lg:w-1/3'>
              <ul>
                {{#each bundle.prices as |price|}}
                  <li>{{price}}</li>
                {{/each}}
                {{#if bundle.specialText}}
                  <li class='text-md md:text-lg text-red-700 italic font-semibold'>
                    {{bundle.specialText}}
                  </li>
                {{/if}}
              </ul>
            </div>

            {{#each (splitIn 2 bundle.items) as |columnItems index|}}
              <div
                class='{{if (eq index 0) "mt-4" "sm:mt-4"}} sm:text-lg sm:w-1/2 lg:mt-0 lg:w-1/3'
              >
                <ul class='pl-8 list-disc'>
                  {{#each columnItems as |item|}}
                    <li>{{item}}</li>
                  {{/each}}
                </ul>
              </div>
            {{/each}}
          </div>
        </Container>
      </section>
    {{/unless}}
  {{/each}}
</template>;

export default MeatTemplate;
