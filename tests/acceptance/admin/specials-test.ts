import { module, test } from 'qunit';
import { click, currentURL, fillIn, findAll, visit } from '@ember/test-helpers';
import { selectFiles } from 'ember-file-upload/test-support';
import { drag } from 'ember-sortable/test-support';
import { Response } from 'miragejs';
import { setupApplicationTest } from 'butchers-market/tests/helpers';
import { setupAuthentication } from 'butchers-market/tests/helpers/authenticate';
import { buttonWithText, columnText, rowWith } from 'butchers-market/tests/helpers/table';
import { testId } from 'butchers-market/tests/helpers/test-id';
import {
  rejectUploads,
  selectHeicImage,
  UNSUPPORTED_IMAGE_ERROR,
} from 'butchers-market/tests/helpers/uploads';
import {
  findRequest,
  requestHeader,
  trackRequests,
} from 'butchers-market/tests/helpers/track-requests';

interface MirageSpecial {
  id: string;
  title: string;
  displayOrder: number;
  inStock: boolean;
}

function rowTitles() {
  return columnText('special', 1);
}

function rowFor(title: string) {
  return rowWith('special', title);
}

// Workflow tests: each change made through the admin reaches the API.
module('Acceptance | admin | specials', function (hooks) {
  setupApplicationTest(hooks);
  setupAuthentication(hooks);

  hooks.beforeEach(function () {
    // @ts-expect-error: There are no types for the Mirage server.
    const server = this.server;

    server.create('special', {
      title: 'Brisket',
      displayOrder: 1,
      imageUrl: 'brisket.jpg',
      activeStartDate: new Date(2026, 0, 15),
      activeEndDate: new Date(2026, 0, 31, 23, 59, 59),
      inStock: true,
    });
    server.create('special', {
      title: 'Meatloaf',
      displayOrder: 2,
      imageUrl: 'meatloaf.jpg',
      activeStartDate: null,
      activeEndDate: null,
      inStock: false,
    });
  });

  test('it lists the specials in display order with their dates', async function (assert) {
    await visit('/admin/specials');

    assert.deepEqual(rowTitles(), ['Brisket', 'Meatloaf']);
    assert.dom(rowFor('Brisket')).includesText('01/15/2026');
    assert.dom(rowFor('Brisket')).includesText('01/31/2026');
  });

  test('it creates a special', async function (assert) {
    // Start from the list, so it's already loaded when the new record is saved.
    await visit('/admin/specials');
    await click('a[href="/admin/specials/new"]');
    assert.strictEqual(currentURL(), '/admin/specials/new');

    await fillIn(`${testId('title')} input`, 'Pot Roast');
    await fillIn(`${testId('image-alt-text')} input`, 'A pot roast');
    await selectFiles(
      `${testId('image')} input[type="file"]`,
      new File(['image'], 'pot-roast.png', { type: 'image/png' })
    );
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/specials');
    assert.dom(rowFor('Pot Roast')).exists('the new special is listed');

    // @ts-expect-error: There are no types for the Mirage server.
    const saved = this.server.db.specials.findBy({ title: 'Pot Roast' });
    assert.ok(saved, 'the special was saved');
    assert.strictEqual(saved.imageAltText, 'A pot roast');
    assert.ok(saved.imageUrl, 'the uploaded image is saved on the special');
  });

  test('it edits a special', async function (assert) {
    await visit('/admin/specials');
    await click(`${testId('special')}:first-child ${testId('edit')}`);

    assert.strictEqual(currentURL(), '/admin/specials/1/edit');
    assert.dom(`${testId('title')} input`).hasValue('Brisket');
    assert.dom(`${testId('start-date')} input`).hasValue('01/15/2026');

    await fillIn(`${testId('title')} input`, 'Smoked Brisket');
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/specials');
    assert.dom(rowFor('Smoked Brisket')).exists();

    // @ts-expect-error: There are no types for the Mirage server.
    const saved = this.server.db.specials.find(1);
    assert.strictEqual(saved.title, 'Smoked Brisket');
    assert.strictEqual(
      new Date(saved.activeStartDate).getTime(),
      new Date(2026, 0, 15).getTime(),
      'the start date is sent back unchanged'
    );
  });

  test('it sends saves the way the API expects', async function (assert) {
    // @ts-expect-error: There are no types for the Mirage server.
    const requests = trackRequests(this.server);

    await visit('/admin/specials/1/edit');
    await fillIn(`${testId('title')} input`, 'Smoked Brisket');
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/specials', 'the save succeeded');

    const request = findRequest(requests, 'PATCH', '/api/specials/1');
    assert.ok(request, 'the special was saved with a PATCH');

    const body = JSON.parse(request!.requestBody);

    assert.strictEqual(
      requestHeader(request!, 'Content-Type'),
      'application/vnd.api+json',
      'the API only parses JSON bodies'
    );
    assert.strictEqual(requestHeader(request!, 'Authorization')?.split(' ')[0], 'Bearer');
    assert.strictEqual(body.data.type, 'specials');
    assert.strictEqual(body.data.id, '1');
    assert.strictEqual(body.data.attributes.title, 'Smoked Brisket');
    assert.strictEqual(body.data.attributes.activeStartDate, new Date(2026, 0, 15).toISOString());
  });

  test('it shows the error message from the API when a save fails', async function (assert) {
    // @ts-expect-error: There are no types for the Mirage server.
    this.server.patch('/specials/:id', () => {
      return new Response(422, {}, { errors: [{ status: 422, title: 'Title is taken' }] });
    });

    await visit('/admin/specials/1/edit');
    await fillIn(`${testId('title')} input`, 'Meatloaf');
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/specials/1/edit');
    assert.dom(testId('server-error')).hasText('Title is taken');
    assert.dom(`${testId('title')} input`).hasValue('Meatloaf', 'the edit is kept');
  });

  test('it shows an upload error by the image field', async function (assert) {
    // @ts-expect-error: There are no types for the Mirage server.
    rejectUploads(this.server);

    await visit('/admin/specials/1/edit');
    await fillIn(`${testId('image-alt-text')} input`, 'Sliced brisket');
    await selectHeicImage();
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/specials/1/edit');
    assert.dom(`${testId('image')} ${testId('file-error')}`).hasText(UNSUPPORTED_IMAGE_ERROR);
    assert.dom(testId('server-error')).doesNotExist();
    // @ts-expect-error: There are no types for the Mirage server.
    assert.strictEqual(this.server.db.specials.find(1).imageUrl, 'brisket.jpg');
  });

  test('it requires an image', async function (assert) {
    await visit('/admin/specials/1/edit');
    await click(buttonWithText('Remove Image'));

    assert.dom(`${testId('image')} [data-test-id="label"]`).hasClass('has-errors');
    assert.dom('button[type="submit"]').isDisabled();
  });

  test('it sends the user to sign in when the session has expired', async function (assert) {
    // @ts-expect-error: There are no types for the Mirage server.
    this.server.patch('/specials/:id', () => new Response(401, {}, { errors: [] }));

    await visit('/admin/specials/1/edit');
    await fillIn(`${testId('title')} input`, 'Smoked Brisket');
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/sign-in');
  });

  test('cancelling an edit leaves the special unchanged', async function (assert) {
    await visit('/admin/specials/1/edit');
    await fillIn(`${testId('title')} input`, 'Not saved');
    await click(buttonWithText('Cancel'));

    assert.strictEqual(currentURL(), '/admin/specials');
    assert.dom(rowFor('Brisket')).exists();
    // @ts-expect-error: There are no types for the Mirage server.
    assert.strictEqual(this.server.db.specials.find(1).title, 'Brisket');
  });

  test('it toggles whether a special is in stock from the list', async function (assert) {
    await visit('/admin/specials');
    await click(`${testId('in-stock')} input`);

    // @ts-expect-error: There are no types for the Mirage server.
    const brisket = this.server.db.specials.find(1) as MirageSpecial;
    assert.false(brisket.inStock);
  });

  test('it reorders the specials', async function (assert) {
    // @ts-expect-error: There are no types for the Mirage server.
    const requests = trackRequests(this.server);

    await visit('/admin/specials');
    // Drag Meatloaf's handle above Brisket.
    const [brisket, meatloaf] = findAll(testId('special'));
    const dy = brisket!.getBoundingClientRect().top - meatloaf!.getBoundingClientRect().top - 2;
    await drag('mouse', `${testId('special')}:nth-child(2) ${testId('handle')}`, () => ({
      dx: 0,
      dy,
    }));

    assert.deepEqual(rowTitles(), ['Meatloaf', 'Brisket']);

    const request = findRequest(requests, 'POST', '/api/specials/reorder');
    assert.ok(request, 'the order was saved');
    assert.strictEqual(
      requestHeader(request!, 'Content-Type'),
      'text/plain;charset=UTF-8',
      'the same header as before WarpDrive'
    );
    assert.deepEqual(JSON.parse(request!.requestBody), [{ id: '2' }, { id: '1' }]);

    // @ts-expect-error: There are no types for the Mirage server.
    const specials = this.server.db.specials as { find(id: number): MirageSpecial };
    assert.strictEqual(specials.find(2).displayOrder, 1);
    assert.strictEqual(specials.find(1).displayOrder, 2);
    assert.dom('[data-test-id="server-error"]').doesNotExist();
  });

  test('it deletes a special', async function (assert) {
    await visit('/admin/specials');
    await click(rowFor('Meatloaf').querySelector(testId('delete'))!);

    assert.dom(document.body).includesText('Delete Special?');
    await click(buttonWithText('Yes'));

    assert.deepEqual(rowTitles(), ['Brisket']);
    // @ts-expect-error: There are no types for the Mirage server.
    assert.strictEqual(this.server.db.specials.length, 1);
  });
});
