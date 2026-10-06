import { module, test } from 'qunit';
import { click, currentURL, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'butchers-market/tests/helpers';
import { setupAuthentication } from 'butchers-market/tests/helpers/authenticate';
import { buttonWithText, columnText, rowWith } from 'butchers-market/tests/helpers/table';
import { testId } from 'butchers-market/tests/helpers/test-id';
import {
  findRequest,
  requestHeader,
  trackRequests,
} from 'butchers-market/tests/helpers/track-requests';

function rowNames() {
  return columnText('feature-flag', 0);
}

function rowFor(name: string) {
  return rowWith('feature-flag', name);
}

// Workflow tests: each change made through the admin reaches the API. The admin home page doesn't
// link to feature flags, but the pages still work.
module('Acceptance | admin | feature flags', function (hooks) {
  setupApplicationTest(hooks);
  setupAuthentication(hooks);

  hooks.beforeEach(function () {
    // @ts-expect-error: There are no types for the Mirage server.
    const server = this.server;

    server.create('feature-flag', { name: 'cafe-page', active: true });
    server.create('feature-flag', { name: 'contact-form', active: false });
  });

  test('the app loads the flags when it starts', async function (assert) {
    await visit('/');

    const features = this.owner.lookup('service:features');
    assert.true(features.isEnabled('cafe-page'));
    assert.false(features.isEnabled('contact-form'), 'a flag that is not active');
    assert.false(features.isEnabled('missing'), 'a flag that does not exist');
  });

  test('it lists the flags', async function (assert) {
    await visit('/admin/feature-flags');

    assert.deepEqual(rowNames(), ['cafe-page', 'contact-form']);
    assert.dom(rowFor('cafe-page')).includesText('Yes');
    assert.dom(rowFor('contact-form')).includesText('No');
  });

  test('it creates a flag', async function (assert) {
    // Start from the list, so it's already loaded when the new record is saved.
    await visit('/admin/feature-flags');
    await click('a[href="/admin/feature-flags/new"]');
    assert.strictEqual(currentURL(), '/admin/feature-flags/new');

    await fillIn(`${testId('name')} input`, 'online-ordering');
    await click(`${testId('active')} input`);
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/feature-flags');
    assert.dom(rowFor('online-ordering')).includesText('Yes');

    // @ts-expect-error: There are no types for the Mirage server.
    const saved = this.server.db.featureFlags.findBy({ name: 'online-ordering' });
    assert.true(saved.active);
  });

  test('it edits a flag', async function (assert) {
    // @ts-expect-error: There are no types for the Mirage server.
    const requests = trackRequests(this.server);

    await visit('/admin/feature-flags');
    await click(rowFor('contact-form').querySelector(testId('edit'))!);

    assert.strictEqual(currentURL(), '/admin/feature-flags/2/edit');
    assert.dom(`${testId('name')} input`).hasValue('contact-form');

    await click(`${testId('active')} input`);
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/feature-flags');
    assert.dom(rowFor('contact-form')).includesText('Yes');

    const request = findRequest(requests, 'PATCH', '/api/feature-flags/2');
    assert.ok(request, 'the flag was saved with a PATCH');
    assert.strictEqual(requestHeader(request!, 'Content-Type'), 'application/vnd.api+json');

    const { data } = JSON.parse(request!.requestBody);
    assert.strictEqual(data.type, 'feature-flags');
    assert.strictEqual(data.attributes.name, 'contact-form');
    assert.true(data.attributes.active);
  });

  test('cancelling an edit leaves the flag unchanged', async function (assert) {
    await visit('/admin/feature-flags/1/edit');
    await fillIn(`${testId('name')} input`, 'not-saved');
    await click(buttonWithText('Cancel'));

    assert.strictEqual(currentURL(), '/admin/feature-flags');
    assert.dom(rowFor('cafe-page')).exists();
    // @ts-expect-error: There are no types for the Mirage server.
    assert.strictEqual(this.server.db.featureFlags.find(1).name, 'cafe-page');
  });

  test('it deletes a flag', async function (assert) {
    await visit('/admin/feature-flags');
    await click(rowFor('contact-form').querySelector(testId('delete'))!);

    assert.dom(document.body).includesText('Delete Feature Flag?');
    await click(buttonWithText('Yes'));

    assert.deepEqual(rowNames(), ['cafe-page']);
    // @ts-expect-error: There are no types for the Mirage server.
    assert.strictEqual(this.server.db.featureFlags.length, 1);
  });
});
