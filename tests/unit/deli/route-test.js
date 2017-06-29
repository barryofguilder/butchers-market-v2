import { moduleFor, test } from 'ember-qunit';

moduleFor('route:deli', 'Unit | Route | deli', {
  // Specify the other units that are required for this test.
  needs: ['service:mobile-app']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
