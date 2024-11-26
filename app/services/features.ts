import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type Store from '@ember-data/store';
import type FeatureFlag from '../models/feature-flag';

export default class FeaturesService extends Service {
  @service declare store: Store;

  @tracked _features: FeatureFlag[] = [];

  async load() {
    const flags = await this.store.findAll('feature-flag');
    this._features = flags.slice();
  }

  isEnabled(featureName: string) {
    const flag = this._features.find((feature) => feature.name === featureName);
    return flag?.active || false;
  }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:features')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('features') declare altName: FeaturesService;`.
declare module '@ember/service' {
  interface Registry {
    features: FeaturesService;
  }
}
