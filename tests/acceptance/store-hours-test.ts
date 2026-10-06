import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { addDays } from 'date-fns';
import { setupApplicationTest } from 'butchers-market/tests/helpers';
import { testId } from 'butchers-market/tests/helpers/test-id';

// The home page shows the store and cafe hours. Hours whose date range includes today replace the
// default hours for their type.
module('Acceptance | store hours', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    // @ts-expect-error: There are no types for the Mirage server.
    const server = this.server;

    server.create('hour', {
      type: 'Store',
      default: true,
      label: 'Store Hours',
      line1: 'Mon - Sat: 9am - 6pm',
      line2: 'Sun: Closed',
      line3: null,
      activeStartDate: null,
      activeEndDate: null,
    });
    server.create('hour', {
      type: 'Cafe',
      default: true,
      label: 'Cafe Hours',
      line1: 'Mon - Fri: 8am - 3pm',
      line2: null,
      line3: null,
      activeStartDate: null,
      activeEndDate: null,
    });
  });

  test('it shows the default hours', async function (assert) {
    await visit('/');

    assert.dom(testId('store-hours-title')).hasText('Store Hours');
    assert.dom(testId('store-hours-line')).exists({ count: 2 });
    assert.dom(testId('store-hours-line')).hasText('Mon - Sat: 9am - 6pm');
    assert.dom(testId('cafe-hours-title')).hasText('Cafe Hours');
    assert.dom(testId('cafe-hours-line')).hasText('Mon - Fri: 8am - 3pm');
  });

  test('hours that are active today replace the defaults', async function (assert) {
    // @ts-expect-error: There are no types for the Mirage server.
    const server = this.server;
    const now = new Date();

    server.create('hour', {
      type: 'Store',
      default: false,
      label: 'Store Holiday Hours',
      line1: 'Closed today',
      line2: null,
      line3: null,
      activeStartDate: addDays(now, -1),
      activeEndDate: addDays(now, 1),
    });
    server.create('hour', {
      type: 'Cafe',
      default: false,
      label: 'Old Cafe Holiday Hours',
      line1: 'Closed last week',
      line2: null,
      line3: null,
      activeStartDate: addDays(now, -9),
      activeEndDate: addDays(now, -7),
    });

    await visit('/');

    assert.dom(testId('store-hours-line')).exists({ count: 1 });
    assert.dom(testId('store-hours-line')).hasText('Closed today', 'the active holiday hours');
    assert
      .dom(testId('cafe-hours-line'))
      .hasText('Mon - Fri: 8am - 3pm', 'the defaults when holiday hours have ended');
  });
});
