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

interface MirageDeliItem {
  id: string;
  title: string;
  ingredients: string | null;
  imageUrl: string | null;
  isHidden: boolean;
}

function rowTitles() {
  return columnText('deli-item', 0);
}

function rowFor(title: string) {
  return rowWith('deli-item', title);
}

// Workflow tests: each change made through the admin reaches the API.
module('Acceptance | admin | deli items', function (hooks) {
  setupApplicationTest(hooks);
  setupAuthentication(hooks);

  hooks.beforeEach(function () {
    // @ts-expect-error: There are no types for the Mirage server.
    const server = this.server;

    server.create('deli-item', {
      title: 'Pimiento Cheese',
      ingredients: null,
      imageUrl: 'pimiento.jpg',
      isHidden: false,
    });
    server.create('deli-item', {
      title: 'Chicken Salad',
      ingredients: 'grapes, pecans',
      imageUrl: 'chicken-salad.jpg',
      isHidden: true,
    });
  });

  test('it lists the deli items by title', async function (assert) {
    await visit('/admin/deli-items');

    assert.deepEqual(rowTitles(), ['Chicken Salad', 'Pimiento Cheese']);
    assert.dom(`${testId('is-hidden')} input`, rowFor('Chicken Salad')).isChecked();
    assert.dom(`${testId('is-hidden')} input`, rowFor('Pimiento Cheese')).isNotChecked();
  });

  test('it creates a deli item', async function (assert) {
    // Start from the list, so it's already loaded when the new record is saved.
    await visit('/admin/deli-items');
    await click('a[href="/admin/deli-items/new"]');
    assert.strictEqual(currentURL(), '/admin/deli-items/new');

    await fillIn(`${testId('title')} input`, 'Olive Salad');
    await fillIn(`${testId('ingredients')} textarea`, 'olives, garlic');
    await selectFiles(
      `${testId('image')} input[type="file"]`,
      new File(['image'], 'olive-salad.png', { type: 'image/png' })
    );
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/deli-items');
    assert.dom(rowFor('Olive Salad')).exists('the new deli item is listed');

    // @ts-expect-error: There are no types for the Mirage server.
    const saved = this.server.db.deliItems.findBy({ title: 'Olive Salad' }) as MirageDeliItem;
    assert.ok(saved, 'the deli item was saved');
    assert.strictEqual(saved.ingredients, 'olives, garlic');
    assert.ok(saved.imageUrl, 'the uploaded image is saved on the deli item');
    assert.notOk(saved.imageUrl?.startsWith('data:'), 'the file name is saved, not the preview');
  });

  test('it edits a deli item', async function (assert) {
    // @ts-expect-error: There are no types for the Mirage server.
    const requests = trackRequests(this.server);

    await visit('/admin/deli-items');
    await click(rowFor('Pimiento Cheese').querySelector(testId('edit'))!);

    assert.strictEqual(currentURL(), '/admin/deli-items/1/edit');
    assert.dom(`${testId('title')} input`).hasValue('Pimiento Cheese');

    await fillIn(`${testId('title')} input`, 'Spicy Pimiento Cheese');
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/deli-items');
    assert.dom(rowFor('Spicy Pimiento Cheese')).exists();

    // @ts-expect-error: There are no types for the Mirage server.
    assert.strictEqual(this.server.db.deliItems.find(1).title, 'Spicy Pimiento Cheese');

    const request = findRequest(requests, 'PATCH', '/api/deli-items/1');
    assert.ok(request, 'the deli item was saved with a PATCH');
    assert.strictEqual(requestHeader(request!, 'Content-Type'), 'application/vnd.api+json');

    const { data } = JSON.parse(request!.requestBody);
    assert.strictEqual(data.type, 'deli-items');
    assert.strictEqual(data.attributes.title, 'Spicy Pimiento Cheese');
    assert.strictEqual(data.attributes.imageUrl, 'pimiento.jpg');
  });

  test('cancelling an edit leaves the deli item unchanged', async function (assert) {
    await visit('/admin/deli-items/1/edit');
    await fillIn(`${testId('title')} input`, 'Not saved');
    await click(buttonWithText('Cancel'));

    assert.strictEqual(currentURL(), '/admin/deli-items');
    assert.dom(rowFor('Pimiento Cheese')).exists();
    // @ts-expect-error: There are no types for the Mirage server.
    assert.strictEqual(this.server.db.deliItems.find(1).title, 'Pimiento Cheese');
  });

  test('it hides a deli item from the list', async function (assert) {
    await visit('/admin/deli-items');
    await click(rowFor('Pimiento Cheese').querySelector(`${testId('is-hidden')} input`)!);

    // @ts-expect-error: There are no types for the Mirage server.
    assert.true((this.server.db.deliItems.find(1) as MirageDeliItem).isHidden);
  });

  test('it deletes a deli item', async function (assert) {
    await visit('/admin/deli-items');
    await click(rowFor('Chicken Salad').querySelector(testId('delete'))!);

    assert.dom(document.body).includesText('Delete Deli Item?');
    await click(buttonWithText('Yes'));

    assert.deepEqual(rowTitles(), ['Pimiento Cheese']);
    // @ts-expect-error: There are no types for the Mirage server.
    assert.strictEqual(this.server.db.deliItems.length, 1);
  });
});
