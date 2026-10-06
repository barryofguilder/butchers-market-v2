import { module, test } from 'qunit';
import { click, currentURL, fillIn, settled, visit } from '@ember/test-helpers';
import { setFlatpickrDate } from 'ember-flatpickr/test-support/helpers';
import { setupApplicationTest } from 'butchers-market/tests/helpers';
import { setupAuthentication } from 'butchers-market/tests/helpers/authenticate';
import { buttonWithText, columnText, rowWith } from 'butchers-market/tests/helpers/table';
import { testId } from 'butchers-market/tests/helpers/test-id';
import {
  findRequest,
  requestHeader,
  trackRequests,
} from 'butchers-market/tests/helpers/track-requests';

interface MirageHour {
  id: string;
  type: string;
  default: boolean;
  label: string;
  line1: string;
  line2: string | null;
  activeStartDate: string | Date | null;
  activeEndDate: string | Date | null;
}

function rowLabels() {
  return columnText('hours', 1);
}

function rowFor(label: string) {
  return rowWith('hours', label);
}

// Workflow tests: each change made through the admin reaches the API.
module('Acceptance | admin | hours', function (hooks) {
  setupApplicationTest(hooks);
  setupAuthentication(hooks);

  hooks.beforeEach(function () {
    // @ts-expect-error: There are no types for the Mirage server.
    const server = this.server;

    server.create('hour', {
      type: 'Store',
      default: true,
      label: 'Store Hours',
      line1: 'Mon - Sat: 9am - 6pm',
      line2: 'Sun: Closed',
      activeStartDate: null,
      activeEndDate: null,
    });
    server.create('hour', {
      type: 'Cafe',
      default: false,
      label: 'Cafe Holiday Hours',
      line1: 'Closed',
      line2: null,
      activeStartDate: new Date(2026, 11, 24, 0, 0, 0),
      activeEndDate: new Date(2026, 11, 25, 23, 59, 59),
    });
  });

  test('it lists the hours with their type and dates', async function (assert) {
    await visit('/admin/hours');

    assert.deepEqual(rowLabels(), ['Store Hours', 'Cafe Holiday Hours']);
    assert.dom(rowFor('Store Hours')).includesText('Store');
    assert.dom(rowFor('Store Hours')).includesText('Default');
    assert.dom(rowFor('Cafe Holiday Hours')).includesText('Cafe');
    assert.dom(rowFor('Cafe Holiday Hours')).includesText('12/24/2026');
    assert.dom(rowFor('Cafe Holiday Hours')).includesText('12/25/2026');
    assert
      .dom(testId('delete'), rowFor('Store Hours'))
      .isDisabled('default hours cannot be deleted');
  });

  test('it creates hours', async function (assert) {
    // @ts-expect-error: There are no types for the Mirage server.
    const requests = trackRequests(this.server);

    // Start from the list, so it's already loaded when the new record is saved.
    await visit('/admin/hours');
    await click('a[href="/admin/hours/new"]');
    assert.strictEqual(currentURL(), '/admin/hours/new');

    await click(`${testId('type')} input[value="Cafe"]`);
    await fillIn(`${testId('label')} input`, 'Cafe Summer Hours');
    await fillIn(`${testId('line1')} input`, 'Mon - Fri: 8am - 3pm');
    setFlatpickrDate(`${testId('start-date')} input`, new Date(2026, 5, 1), true);
    setFlatpickrDate(`${testId('end-date')} input`, new Date(2026, 7, 31), true);
    await settled();
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/hours');
    assert.dom(rowFor('Cafe Summer Hours')).exists('the new hours are listed');

    const request = findRequest(requests, 'POST', '/api/hours');
    assert.ok(request, 'the hours were created with a POST');
    assert.strictEqual(requestHeader(request!, 'Content-Type'), 'application/vnd.api+json');

    const { data } = JSON.parse(request!.requestBody);
    assert.strictEqual(data.type, 'hours', 'the JSON:API type');
    assert.strictEqual(data.attributes.type, 'Cafe', 'the type of hours');
    assert.strictEqual(data.attributes.label, 'Cafe Summer Hours');
    assert.strictEqual(data.attributes.line1, 'Mon - Fri: 8am - 3pm');
    assert.strictEqual(
      data.attributes.activeStartDate,
      new Date(2026, 5, 1, 0, 0, 0).toISOString(),
      'the start of the first day'
    );
    assert.strictEqual(
      data.attributes.activeEndDate,
      new Date(2026, 7, 31, 23, 59, 59).toISOString(),
      'the end of the last day'
    );
  });

  test('new hours are store hours for today by default', async function (assert) {
    await visit('/admin/hours/new');
    await fillIn(`${testId('label')} input`, 'Store Hours Today');
    await fillIn(`${testId('line1')} input`, 'Closing early');
    await click('button[type="submit"]');

    const now = new Date();
    // @ts-expect-error: There are no types for the Mirage server.
    const saved = this.server.db.hours.findBy({ label: 'Store Hours Today' }) as MirageHour;
    assert.strictEqual(saved.type, 'Store');
    assert.strictEqual(
      new Date(saved.activeStartDate!).getTime(),
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime()
    );
    assert.strictEqual(
      new Date(saved.activeEndDate!).getTime(),
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime()
    );
  });

  test('it edits hours', async function (assert) {
    // @ts-expect-error: There are no types for the Mirage server.
    const requests = trackRequests(this.server);

    await visit('/admin/hours');
    await click(rowFor('Cafe Holiday Hours').querySelector(testId('edit'))!);

    assert.strictEqual(currentURL(), '/admin/hours/2/edit');
    assert.dom(`${testId('type')} input`).hasValue('Cafe');
    assert.dom(`${testId('type')} input`).hasAttribute('readonly', '', 'the type is read only');
    assert.dom(`${testId('start-date')} input`).hasValue('12/24/2026');

    await fillIn(`${testId('line1')} input`, 'Closed for Christmas');
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/hours');
    // @ts-expect-error: There are no types for the Mirage server.
    assert.strictEqual(this.server.db.hours.find(2).line1, 'Closed for Christmas');

    const request = findRequest(requests, 'PATCH', '/api/hours/2');
    assert.ok(request, 'the hours were saved with a PATCH');

    const { data } = JSON.parse(request!.requestBody);
    assert.strictEqual(data.attributes.type, 'Cafe');
    assert.strictEqual(
      data.attributes.activeStartDate,
      new Date(2026, 11, 24, 0, 0, 0).toISOString(),
      'the start date is sent back unchanged'
    );
  });

  test('cancelling an edit leaves the hours unchanged', async function (assert) {
    await visit('/admin/hours/1/edit');
    await fillIn(`${testId('label')} input`, 'Not saved');
    await click(buttonWithText('Cancel'));

    assert.strictEqual(currentURL(), '/admin/hours');
    assert.dom(rowFor('Store Hours')).exists();
    // @ts-expect-error: There are no types for the Mirage server.
    assert.strictEqual(this.server.db.hours.find(1).label, 'Store Hours');
  });

  test('it deletes hours', async function (assert) {
    await visit('/admin/hours');
    await click(rowFor('Cafe Holiday Hours').querySelector(testId('delete'))!);

    assert.dom(document.body).includesText('Delete Hours?');
    await click(buttonWithText('Yes'));

    assert.deepEqual(rowLabels(), ['Store Hours']);
    // @ts-expect-error: There are no types for the Mirage server.
    assert.strictEqual(this.server.db.hours.length, 1);
  });
});
