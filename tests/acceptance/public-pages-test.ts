import { module, test } from 'qunit';
import { currentURL, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'butchers-market/tests/helpers';
import seedDefaultScenario from 'butchers-market/mirage/scenarios/default';

// Smoke tests: each public page loads its data from the API and renders it.
module('Acceptance | public pages', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    // @ts-expect-error: There are no types for the Mirage server.
    seedDefaultScenario(this.server);
  });

  test('the home page shows active specials, featured bundles, and reviews', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/');
    assert.dom('[alt="Smoked Boneless Turkey Breast"]').exists('an active special');
    assert.dom('[alt="Meatloaf"]').exists('another active special');
    assert.dom('[alt="Beef Stew"]').doesNotExist('a special that has ended');
    assert.dom(document.body).includesText('20lb Meat Pack', 'a featured bundle');
    assert.dom(document.body).doesNotIncludeText('30lb Meat Pack', 'a bundle that is not featured');
    assert.dom(document.body).includesText('Contributor', 'the reviews');
  });

  test('the deli page shows the deli items', async function (assert) {
    await visit('/deli');

    assert.strictEqual(currentURL(), '/deli');
    assert.dom(document.body).includesText('Rotisserie Chicken Salad');
  });

  test('the meat page shows the meat bundles', async function (assert) {
    await visit('/meat');

    assert.strictEqual(currentURL(), '/meat');
    assert.dom(document.body).includesText('20lb Meat Pack');
    assert.dom(document.body).includesText('Bundle Packs');
  });

  test('the grab and go page shows the holiday and everyday items', async function (assert) {
    await visit('/grab-and-go');

    assert.strictEqual(currentURL(), '/grab-and-go');
    assert.dom(document.body).includesText('Holiday Grab & Go Items');
    assert.dom(document.body).includesText('Turkey');
    assert.dom(document.body).includesText('Original meatloaf');
  });
});
