import EmberObject from '@ember/object';
import MobileAppMixinMixin from 'butchers-market/mixins/mobile-app-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | mobile app mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let MobileAppMixinObject = EmberObject.extend(MobileAppMixinMixin);
  let subject = MobileAppMixinObject.create();
  assert.ok(subject);
});
