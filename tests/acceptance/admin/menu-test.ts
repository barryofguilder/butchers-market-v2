import { module, test } from 'qunit';
import { click, currentURL, visit } from '@ember/test-helpers';
import { selectFiles } from 'ember-file-upload/test-support';
import { setupApplicationTest } from 'butchers-market/tests/helpers';
import { setupAuthentication } from 'butchers-market/tests/helpers/authenticate';
import { buttonWithText, rowWith } from 'butchers-market/tests/helpers/table';
import { testId } from 'butchers-market/tests/helpers/test-id';
import {
  findRequest,
  requestHeader,
  trackRequests,
} from 'butchers-market/tests/helpers/track-requests';

// Workflow tests: each change made through the admin reaches the API. The menu can only be edited;
// there is always exactly one.
module('Acceptance | admin | menu', function (hooks) {
  setupApplicationTest(hooks);
  setupAuthentication(hooks);

  hooks.beforeEach(function () {
    // @ts-expect-error: There are no types for the Mirage server.
    this.server.create('menu', {
      fileUrl: 'menu-2026.pdf',
      updatedAt: new Date(2026, 8, 3, 14, 30),
    });
  });

  test('it shows when the menu was last updated', async function (assert) {
    await visit('/admin/menu');

    assert.dom(rowWith('menu', '09/03/2026')).includesText('09/03/2026 2:30PM');
  });

  test('it replaces the menu PDF', async function (assert) {
    // @ts-expect-error: There are no types for the Mirage server.
    const requests = trackRequests(this.server);

    await visit('/admin/menu');
    await click(rowWith('menu', '09/03/2026').querySelector(testId('edit'))!);

    assert.strictEqual(currentURL(), '/admin/menu/1/edit');

    await selectFiles(
      `${testId('file')} input[type="file"]`,
      new File(['pdf'], 'new-menu.pdf', { type: 'application/pdf' })
    );
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/menu');

    // @ts-expect-error: There are no types for the Mirage server.
    const { fileUrl } = this.server.db.menus.find(1) as { fileUrl: string };
    assert.notStrictEqual(fileUrl, 'menu-2026.pdf', 'the new file is saved on the menu');
    assert.true(fileUrl.endsWith('.pdf'));

    const request = findRequest(requests, 'PATCH', '/api/menus/1');
    assert.ok(request, 'the menu was saved with a PATCH');
    assert.strictEqual(requestHeader(request!, 'Content-Type'), 'application/vnd.api+json');

    const { data } = JSON.parse(request!.requestBody);
    assert.strictEqual(data.type, 'menus');
    assert.strictEqual(data.attributes.fileUrl, fileUrl);
  });

  test('cancelling an edit leaves the menu unchanged', async function (assert) {
    await visit('/admin/menu/1/edit');
    await selectFiles(
      `${testId('file')} input[type="file"]`,
      new File(['pdf'], 'new-menu.pdf', { type: 'application/pdf' })
    );
    await click(buttonWithText('Cancel'));

    assert.strictEqual(currentURL(), '/admin/menu');
    // @ts-expect-error: There are no types for the Mirage server.
    assert.strictEqual(this.server.db.menus.find(1).fileUrl, 'menu-2026.pdf');
  });
});
