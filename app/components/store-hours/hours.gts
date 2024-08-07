import Component from '@glimmer/component';
import type Hour from '../../models/hour';

export interface StoreHoursHoursSignature {
  Element: HTMLDivElement;
  Args: {
    hours: Hour;
  };
  Blocks: {
    default: [];
  };
}

export default class StoreHoursHoursComponent extends Component<StoreHoursHoursSignature> {
  get hourType() {
    if (this.args.hours) {
      return this.args.hours.type;
    }

    return '';
  }

  get hourTypeTestId() {
    return this.hourType.toLowerCase();
  }

  <template>
    <div ...attributes>
      <h3
        data-test-id='{{this.hourTypeTestId}}-hours-title'
        class='text-2xl tracking-wide uppercase font-black'
      >
        {{this.hourType}}
        Hours
      </h3>
      <p data-test-id='{{this.hourTypeTestId}}-hours-line'>{{@hours.line1}}</p>
      {{#if @hours.line2}}
        <p data-test-id='{{this.hourTypeTestId}}-hours-line' class='mt-1'>{{@hours.line2}}</p>
      {{/if}}
      {{#if @hours.line3}}
        <p data-test-id='{{this.hourTypeTestId}}-hours-line' class='mt-1'>{{@hours.line3}}</p>
      {{/if}}
    </div>
  </template>
}
