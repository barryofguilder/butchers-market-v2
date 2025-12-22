import type { TOC } from '@ember/component/template-only';
// @ts-expect-error: There are no types for this.
import InHead from 'ember-head/components/in-head';
import config from '../config/environment';

const isProduction = config.environment === 'production';

const AnalyticsScritps: TOC<{
  Element: null;
}> = <template>
  {{#if isProduction}}
    <InHead>
      {{! template-lint-disable no-forbidden-elements }}
      <script async src='https://www.googletagmanager.com/gtag/js?id=G-F0503M6K3V'></script>
      <script>
        window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date()); gtag('config', 'G-F0503M6K3V');
      </script>
    </InHead>
  {{/if}}
</template>;

export default AnalyticsScritps;
