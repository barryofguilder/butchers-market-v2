import { module, test } from 'qunit';
import { click, currentURL, fillIn, visit } from '@ember/test-helpers';
import { selectFiles } from 'ember-file-upload/test-support';
import { setupApplicationTest } from 'butchers-market/tests/helpers';
import { setupAuthentication } from 'butchers-market/tests/helpers/authenticate';
import { buttonWithText, columnText, rowWith } from 'butchers-market/tests/helpers/table';
import { testId } from 'butchers-market/tests/helpers/test-id';
import {
  findRequest,
  requestHeader,
  trackRequests,
} from 'butchers-market/tests/helpers/track-requests';

interface MiragePackageBundle {
  id: string;
  title: string;
  fileUrl: string | null;
  prices: string[];
  items: string[];
}

function rowTitles() {
  return columnText('package-bundle', 0);
}

function rowFor(title: string) {
  return rowWith('package-bundle', title);
}

function listInput(list: 'prices' | 'items', index: number) {
  return `${testId(list)} ${testId(`item-${index}`)} input`;
}

// Workflow tests: each change made through the admin reaches the API. Package bundles can only be
// edited; the API has no create or delete for them.
module('Acceptance | admin | package bundles', function (hooks) {
  setupApplicationTest(hooks);
  setupAuthentication(hooks);

  hooks.beforeEach(function () {
    // @ts-expect-error: There are no types for the Mirage server.
    const server = this.server;

    server.create('package-bundle', {
      title: "Mix N' Match",
      displayOrder: 1,
      fileUrl: 'mix-n-match.pdf',
      specialText: null,
      prices: ['Pick 5 for $53', 'Pick 10 for $99'],
      items: ['2 lbs. Beef Stew', '3 lbs. Bratwurst', '2 lbs. Raw Shrimp'],
    });
  });

  test('it lists the bundles', async function (assert) {
    await visit('/admin/package-bundles');

    assert.deepEqual(rowTitles(), ["Mix N' Match"]);
    assert.dom(rowFor("Mix N' Match")).includesText('3 Items');
  });

  test('it edits a bundle', async function (assert) {
    // @ts-expect-error: There are no types for the Mirage server.
    const requests = trackRequests(this.server);

    await visit('/admin/package-bundles');
    await click(rowFor("Mix N' Match").querySelector(testId('edit'))!);

    assert.strictEqual(currentURL(), '/admin/package-bundles/1/edit');
    assert.dom(listInput('prices', 1)).hasValue('Pick 10 for $99');
    assert.dom(listInput('items', 2)).hasValue('2 lbs. Raw Shrimp');

    await fillIn(`${testId('title')} input`, "Mix N' Match Deluxe");
    await click(buttonWithText('New Price'));
    await fillIn(listInput('prices', 2), 'Pick 20 for $195');
    await fillIn(listInput('items', 0), '3 lbs. Beef Stew');
    await selectFiles(
      `${testId('file')} input[type="file"]`,
      new File(['pdf'], 'flyer.pdf', { type: 'application/pdf' })
    );
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/package-bundles');
    assert.dom(rowFor("Mix N' Match Deluxe")).exists();

    // @ts-expect-error: There are no types for the Mirage server.
    const saved = this.server.db.packageBundles.find(1) as MiragePackageBundle;
    assert.deepEqual(saved.prices, ['Pick 5 for $53', 'Pick 10 for $99', 'Pick 20 for $195']);
    assert.deepEqual(saved.items, ['3 lbs. Beef Stew', '3 lbs. Bratwurst', '2 lbs. Raw Shrimp']);
    assert.notStrictEqual(saved.fileUrl, 'mix-n-match.pdf', 'the new flyer is saved');

    const request = findRequest(requests, 'PATCH', '/api/package-bundles/1');
    assert.ok(request, 'the bundle was saved with a PATCH');
    assert.strictEqual(requestHeader(request!, 'Content-Type'), 'application/vnd.api+json');

    const { data } = JSON.parse(request!.requestBody);
    assert.strictEqual(data.type, 'package-bundles');
    assert.deepEqual(data.attributes.prices, saved.prices);
    assert.deepEqual(data.attributes.items, saved.items);
  });

  test('cancelling an edit leaves the bundle unchanged', async function (assert) {
    await visit('/admin/package-bundles/1/edit');
    await fillIn(`${testId('title')} input`, 'Not saved');
    await fillIn(listInput('prices', 0), 'Not saved either');
    await click(buttonWithText('Cancel'));

    assert.strictEqual(currentURL(), '/admin/package-bundles');

    // @ts-expect-error: There are no types for the Mirage server.
    const bundle = this.server.db.packageBundles.find(1) as MiragePackageBundle;
    assert.strictEqual(bundle.title, "Mix N' Match");
    assert.deepEqual(bundle.prices, ['Pick 5 for $53', 'Pick 10 for $99']);

    await visit('/admin/package-bundles/1/edit');
    assert
      .dom(listInput('prices', 0))
      .hasValue('Pick 5 for $53', 'the form shows the saved prices');
  });
});
