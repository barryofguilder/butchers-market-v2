import EmberObject from '@ember/object';
import MediaMixinMixin from 'butchers-market/mixins/media-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | media mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let MediaMixinObject = EmberObject.extend(MediaMixinMixin);
  let subject = MediaMixinObject.create();
  assert.ok(subject);
});
