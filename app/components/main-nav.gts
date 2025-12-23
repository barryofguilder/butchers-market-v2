import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { LinkTo } from '@ember/routing';
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';
import MainNavContainer from './main-nav/container';
import MainNavItems from './main-nav/main-nav-items';

export default class MainNavComponent extends Component {
  @tracked showNavigation = false;

  @action
  toggleNavigation() {
    this.showNavigation = !this.showNavigation;
  }

  <template>
    <header class='bg-white fixed z-40 top-0 inset-x-0'>
      <MainNavContainer>
        <div class='absolute pt-2 z-40 flex'>
          <LinkTo @route='application'>
            <img
              class='w-32 h-auto'
              src='/images/butchers-market-logo.svg'
              alt="The Butcher's Market"
            />
          </LinkTo>
        </div>

        <div class='flex items-center justify-end h-20 lg:hidden'>
          <button
            type='button'
            class='flex items-center justify-center h-12 px-3 text-gray-600 text-2xl border rounded-sm focus:outline-hidden focus:ring-3'
            aria-controls='main-navigation-items'
            aria-expanded={{if this.showNavigation 'true' 'false'}}
            aria-label='Toggle navigation'
            {{on 'click' this.toggleNavigation}}
          >
            <FaIcon @icon='bars' />
          </button>
        </div>

        <nav
          class='overflow-hidden transition-all duration-300 ease-in-out origin-top lg:flex lg:justify-end lg:h-20
            {{if
              this.showNavigation
              "max-h-96 opacity-100 lg:max-h-none"
              "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"
            }}'
          id='main-navigation-items'
          aria-label='site navigation'
        >
          <MainNavItems @itemClicked={{this.toggleNavigation}} />
        </nav>
      </MainNavContainer>
    </header>
  </template>
}
