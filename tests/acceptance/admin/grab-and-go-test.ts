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
import {
  rejectUploads,
  selectHeicImage,
  UNSUPPORTED_IMAGE_ERROR,
} from 'butchers-market/tests/helpers/uploads';

interface MirageGrabAndGo {
  id: string;
  title: string;
  socialTitle: string | null;
  description: string | null;
  imageUrl: string | null;
  inStock: boolean;
  isHoliday: boolean;
}

function rowTitles() {
  return columnText('grab-and-go', 0);
}

function rowFor(title: string) {
  return rowWith('grab-and-go', title);
}

// Workflow tests: each change made through the admin reaches the API.
module('Acceptance | admin | grab and go', function (hooks) {
  setupApplicationTest(hooks);
  setupAuthentication(hooks);

  hooks.beforeEach(function () {
    // @ts-expect-error: There are no types for the Mirage server.
    const server = this.server;

    server.create('grab-and-go', {
      title: 'Meatloaf',
      socialTitle: 'Mom’s Meatloaf',
      description: 'With gravy',
      imageUrl: 'meatloaf.jpg',
      inStock: true,
      isHoliday: false,
    });
    server.create('grab-and-go', {
      title: 'Turkey',
      socialTitle: null,
      description: 'Whole smoked turkey',
      imageUrl: null,
      inStock: true,
      isHoliday: true,
    });
    server.create('grab-and-go', {
      title: 'Smoked Queso',
      socialTitle: null,
      description: null,
      imageUrl: null,
      inStock: false,
      isHoliday: false,
    });
  });

  test('it filters the items by stock', async function (assert) {
    await visit('/admin/grab-and-go');

    assert.deepEqual(rowTitles(), ['Meatloaf', 'Turkey'], 'in stock items by default');

    await click(buttonWithText('Out of Stock'));
    assert.deepEqual(rowTitles(), ['Smoked Queso']);

    await click(buttonWithText('All'));
    assert.deepEqual(rowTitles(), ['Meatloaf', 'Turkey', 'Smoked Queso']);
    assert.dom(`${testId('is-holiday')} input`, rowFor('Turkey')).isChecked();
    assert.dom(`${testId('is-holiday')} input`, rowFor('Meatloaf')).isNotChecked();
  });

  test('it creates an item', async function (assert) {
    // Start from the list, so it's already loaded when the new record is saved.
    await visit('/admin/grab-and-go');
    await click('a[href="/admin/grab-and-go/new"]');
    assert.strictEqual(currentURL(), '/admin/grab-and-go/new');

    await fillIn(`${testId('title')} input`, 'Chicken Casserole');
    await fillIn(`${testId('social-title')} input`, 'Cheesy Chicken Casserole');
    await fillIn(`${testId('description')} textarea`, 'Feeds four');
    await selectFiles(
      `${testId('image')} input[type="file"]`,
      new File(['image'], 'casserole.png', { type: 'image/png' })
    );
    await click(`${testId('in-stock')} input`);
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/grab-and-go');
    assert.dom(rowFor('Chicken Casserole')).exists('the new item is listed');

    // @ts-expect-error: There are no types for the Mirage server.
    const { grabAndGos } = this.server.db;
    const saved = grabAndGos.findBy({ title: 'Chicken Casserole' }) as MirageGrabAndGo;
    assert.ok(saved, 'the item was saved');
    assert.strictEqual(saved.socialTitle, 'Cheesy Chicken Casserole');
    assert.strictEqual(saved.description, 'Feeds four');
    assert.true(saved.inStock);
    assert.notOk(saved.isHoliday, 'not sent, so the API default applies');
    assert.ok(saved.imageUrl, 'the uploaded image is saved on the item');
  });

  test('it edits an item', async function (assert) {
    // @ts-expect-error: There are no types for the Mirage server.
    const requests = trackRequests(this.server);

    await visit('/admin/grab-and-go');
    await click(rowFor('Meatloaf').querySelector(testId('edit'))!);

    assert.strictEqual(currentURL(), '/admin/grab-and-go/1/edit');
    assert.dom(`${testId('title')} input`).hasValue('Meatloaf');
    assert.dom(`${testId('social-title')} input`).hasValue('Mom’s Meatloaf');

    await fillIn(`${testId('title')} input`, 'Classic Meatloaf');
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/grab-and-go');
    assert.dom(rowFor('Classic Meatloaf')).exists();

    // @ts-expect-error: There are no types for the Mirage server.
    assert.strictEqual(this.server.db.grabAndGos.find(1).title, 'Classic Meatloaf');

    const request = findRequest(requests, 'PATCH', '/api/grab-and-gos/1');
    assert.ok(request, 'the item was saved with a PATCH');
    assert.strictEqual(requestHeader(request!, 'Content-Type'), 'application/vnd.api+json');

    const { data } = JSON.parse(request!.requestBody);
    assert.strictEqual(data.type, 'grab-and-gos');
    assert.strictEqual(data.attributes.title, 'Classic Meatloaf');
    assert.strictEqual(data.attributes.socialTitle, 'Mom’s Meatloaf');
  });

  test('it shows an upload error by the image field', async function (assert) {
    // @ts-expect-error: There are no types for the Mirage server.
    rejectUploads(this.server);

    await visit('/admin/grab-and-go/1/edit');
    await selectHeicImage();
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/grab-and-go/1/edit');
    assert.dom(`${testId('image')} ${testId('file-error')}`).hasText(UNSUPPORTED_IMAGE_ERROR);
    assert.dom(testId('server-error')).doesNotExist();
    // @ts-expect-error: There are no types for the Mirage server.
    assert.strictEqual(this.server.db.grabAndGos.find(1).imageUrl, 'meatloaf.jpg');
  });

  test('cancelling an edit leaves the item unchanged', async function (assert) {
    await visit('/admin/grab-and-go/1/edit');
    await fillIn(`${testId('title')} input`, 'Not saved');
    await click(buttonWithText('Cancel'));

    assert.strictEqual(currentURL(), '/admin/grab-and-go');
    assert.dom(rowFor('Meatloaf')).exists();
    // @ts-expect-error: There are no types for the Mirage server.
    assert.strictEqual(this.server.db.grabAndGos.find(1).title, 'Meatloaf');
  });

  test('it marks items out of stock and as holiday items from the list', async function (assert) {
    await visit('/admin/grab-and-go');
    await click(rowFor('Meatloaf').querySelector(`${testId('is-holiday')} input`)!);
    await click(rowFor('Meatloaf').querySelector(`${testId('in-stock')} input`)!);

    // @ts-expect-error: There are no types for the Mirage server.
    const meatloaf = this.server.db.grabAndGos.find(1) as MirageGrabAndGo;
    assert.true(meatloaf.isHoliday);
    assert.false(meatloaf.inStock);
    assert.deepEqual(rowTitles(), ['Turkey'], 'the item leaves the in stock list');
  });

  test('it deletes an item', async function (assert) {
    await visit('/admin/grab-and-go');
    await click(rowFor('Turkey').querySelector(testId('delete'))!);

    assert.dom(document.body).includesText('Delete Grab and Go Item?');
    await click(buttonWithText('Yes'));

    assert.deepEqual(rowTitles(), ['Meatloaf']);
    // @ts-expect-error: There are no types for the Mirage server.
    assert.strictEqual(this.server.db.grabAndGos.length, 2);
  });

  test('the social titles list the in stock items', async function (assert) {
    await visit('/admin/grab-and-go/social');

    assert.dom(document.body).includesText('Mom’s Meatloaf', 'the social title when there is one');
    assert.dom(document.body).includesText('Turkey', 'the title otherwise');
    assert.dom(document.body).doesNotIncludeText('Smoked Queso', 'an item that is out of stock');
  });
});
