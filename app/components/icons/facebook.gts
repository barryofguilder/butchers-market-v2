import type { TOC } from '@ember/component/template-only';

const FacebookIcon: TOC<{
  Element: SVGElement;
}> = <template>
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 640 640'
    aria-hidden='true'
    class='inline-block'
    ...attributes
  >
    <path
      fill='currentColor'
      d='M240 363.3L240 576L356 576L356 363.3L442.5 363.3L460.5 265.5L356 265.5L356 230.9C356 179.2 376.3 159.4 428.7 159.4C445 159.4 458.1 159.8 465.7 160.6L465.7 71.9C451.4 68 416.4 64 396.2 64C289.3 64 240 114.5 240 223.4L240 265.5L174 265.5L174 363.3L240 363.3z'
    />
  </svg>
</template>;

export default FacebookIcon;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Icons::Facebook': typeof FacebookIcon;
  }
}
