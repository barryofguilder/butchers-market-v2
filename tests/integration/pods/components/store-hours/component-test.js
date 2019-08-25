import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { findAll, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import testId from '../../../../helpers/test-id';
import { freezeDateAt, unfreezeDate } from 'ember-mockdate-shim';

module('Integration | Component | store-hours', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders the default hours for `Store`', async function(assert) {
    this.set('myHours', [
      {
        type: 'Store',
        default: true,
        line1: 'Sunday: Closed',
        line2: 'Mon - Fri: 8am - 5pm',
        line3: 'Saturday: 8am - 10pm',
      },
      {
        type: 'Cafe',
        default: true,
        line1: 'Sunday: 1pm - 5pm',
        line2: 'Mon - Fri: 5pm - 10pm',
        line3: 'Saturday: 6pm - 11pm',
      },
    ]);
    await render(hbs`<StoreHours @hours={{myHours}} />`);

    assert.dom(testId('store-hours-title')).hasText('Store Hours');

    const lines = findAll(testId('store-hours-line'));
    assert.dom(lines[0]).hasText('Sunday: Closed');
    assert.dom(lines[1]).hasText('Mon - Fri: 8am - 5pm');
    assert.dom(lines[2]).hasText('Saturday: 8am - 10pm');
  });

  test('it renders the hours for `Cafe`', async function(assert) {
    this.set('myHours', [
      {
        type: 'Store',
        default: true,
        line1: 'Sunday: Closed',
        line2: 'Mon - Fri: 8am - 5pm',
        line3: 'Saturday: 8am - 10pm',
      },
      {
        type: 'Cafe',
        default: true,
        line1: 'Sunday: 1pm - 5pm',
        line2: 'Mon - Fri: 5pm - 10pm',
        line3: 'Saturday: 6pm - 11pm',
      },
    ]);
    await render(hbs`<StoreHours @hours={{myHours}} @hourType="Cafe" />`);

    assert.dom(testId('store-hours-title')).hasText('Cafe Hours');

    const lines = findAll(testId('store-hours-line'));
    assert.dom(lines[0]).hasText('Sunday: 1pm - 5pm');
    assert.dom(lines[1]).hasText('Mon - Fri: 5pm - 10pm');
    assert.dom(lines[2]).hasText('Saturday: 6pm - 11pm');
  });

  test('it renders only two lines', async function(assert) {
    this.set('myHours', [
      {
        type: 'Store',
        default: true,
        line1: 'Sunday: Closed',
        line2: 'Mon - Sat: 8am - 5pm',
      },
    ]);
    await render(hbs`<StoreHours @hours={{myHours}} />`);

    assert.dom(testId('store-hours-title')).hasText('Store Hours');
    assert.dom(testId('store-hours-line')).exists({ count: 2 });

    const lines = findAll(testId('store-hours-line'));
    assert.dom(lines[0]).hasText('Sunday: Closed');
    assert.dom(lines[1]).hasText('Mon - Sat: 8am - 5pm');
  });

  test('it renders only one line', async function(assert) {
    this.set('myHours', [
      {
        type: 'Store',
        default: true,
        line1: 'Always open',
      },
    ]);
    await render(hbs`<StoreHours @hours={{myHours}} />`);

    assert.dom(testId('store-hours-title')).hasText('Store Hours');
    assert.dom(testId('store-hours-line')).exists({ count: 1 });
    assert.dom(testId('store-hours-line')).hasText('Always open');
  });

  test('it renders the `Store` hours for the given time frame instead of the default', async function(assert) {
    freezeDateAt(new Date(2019, 2, 18, 6, 0, 0));

    this.set('myHours', [
      {
        type: 'Store',
        activeStartDate: new Date(2019, 2, 1),
        activeEndDate: new Date(2019, 2, 30),
        line1: 'Always open',
      },
      {
        type: 'Store',
        default: true,
        line1: 'Sunday: Closed',
        line2: 'Mon - Fri: 8am - 5pm',
        line3: 'Saturday: 8am - 10pm',
      },
    ]);
    await render(hbs`<StoreHours @hours={{myHours}} />`);

    assert.dom(testId('store-hours-title')).hasText('Store Hours');
    assert.dom(testId('store-hours-line')).exists({ count: 1 });
    assert.dom(testId('store-hours-line')).hasText('Always open');

    unfreezeDate();
  });

  test('it renders the default `Store` hours when out of the custom time frame', async function(assert) {
    freezeDateAt(new Date(2019, 3, 1, 6, 0, 0));

    this.set('myHours', [
      {
        type: 'Store',
        activeStartDate: new Date(2019, 2, 1),
        activeEndDate: new Date(2019, 2, 30),
        line1: 'Always open',
      },
      {
        type: 'Store',
        default: true,
        line1: 'Sunday: Closed',
        line2: 'Mon - Fri: 8am - 5pm',
        line3: 'Saturday: 8am - 10pm',
      },
    ]);
    await render(hbs`<StoreHours @hours={{myHours}} />`);

    assert.dom(testId('store-hours-title')).hasText('Store Hours');
    assert.dom(testId('store-hours-line')).exists({ count: 3 });

    const lines = findAll(testId('store-hours-line'));
    assert.dom(lines[0]).hasText('Sunday: Closed');
    assert.dom(lines[1]).hasText('Mon - Fri: 8am - 5pm');
    assert.dom(lines[2]).hasText('Saturday: 8am - 10pm');

    unfreezeDate();
  });
});
