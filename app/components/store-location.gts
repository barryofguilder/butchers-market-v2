import type { TOC } from '@ember/component/template-only';
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';

const StoreLocation: TOC<{
  Element: HTMLDivElement;
}> = <template>
  <div ...attributes>
    <div>
      <span class='inline-block w-6'>
        <FaIcon @icon='map-marker-alt' />
      </span>
      <a
        class='hover:border-b hover:border-white'
        href='https://www.google.com/maps?q=3619+Cleveland+Highway,+Dalton,+GA'
        target='_blank'
        rel='noopener noreferrer'
      >
        3619 Cleveland Highway, Dalton, GA
      </a>
    </div>
    <div class='mt-1'>
      <span class='inline-block w-6'>
        <FaIcon @icon='phone' />
      </span>
      <a class='hover:border-b hover:border-white' href='tel:7062799277'>
        (706) 279-9277
      </a>
    </div>
  </div>
</template>;

export default StoreLocation;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    StoreLocation: typeof StoreLocation;
  }
}
