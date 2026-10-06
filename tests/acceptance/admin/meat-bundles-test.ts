import { module, test } from 'qunit';
import { click, currentURL, fillIn, findAll, visit } from '@ember/test-helpers';
import { drag } from 'ember-sortable/test-support';
import { setupApplicationTest } from 'butchers-market/tests/helpers';
import { setupAuthentication } from 'butchers-market/tests/helpers/authenticate';
import { buttonWithText, columnText, rowWith } from 'butchers-market/tests/helpers/table';
import { testId } from 'butchers-market/tests/helpers/test-id';
import {
  findRequest,
  requestHeader,
  trackRequests,
} from 'butchers-market/tests/helpers/track-requests';

interface MirageMeatBundle {
  id: string;
  title: string;
  price: string;
  displayOrder: number;
  featured: boolean;
  items: string[];
}

function rowTitles() {
  return columnText('meat-bundle', 1);
}

function rowFor(title: string) {
  return rowWith('meat-bundle', title);
}

function itemInput(index: number) {
  return `${testId('items')} ${testId(`item-${index}`)} input`;
}

// Workflow tests: each change made through the admin reaches the API.
module('Acceptance | admin | meat bundles', function (hooks) {
  setupApplicationTest(hooks);
  setupAuthentication(hooks);

  hooks.beforeEach(function () {
    // @ts-expect-error: There are no types for the Mirage server.
    const server = this.server;

    server.create('meat-bundle', {
      title: '20lb Meat Pack',
      price: '$99.99',
      displayOrder: 1,
      featured: true,
      isHidden: false,
      orderEnabled: true,
      specialText: null,
      items: ['5 lbs. Ground Chuck', '5 lbs. Chicken Breast'],
    });
    server.create('meat-bundle', {
      title: '30lb Meat Pack',
      price: '$149.99',
      displayOrder: 2,
      featured: false,
      isHidden: true,
      orderEnabled: false,
      specialText: 'Limited time',
      items: ['10 lbs. Ground Chuck'],
    });
  });

  test('it lists the bundles in display order', async function (assert) {
    await visit('/admin/meat-bundles');

    assert.deepEqual(rowTitles(), ['20lb Meat Pack', '30lb Meat Pack']);
    assert.dom(rowFor('20lb Meat Pack')).includesText('2 Items');
    assert.dom(rowFor('20lb Meat Pack')).includesText('Featured');
    assert.dom(rowFor('30lb Meat Pack')).includesText('Hidden');
    assert.dom(rowFor('30lb Meat Pack')).includesText('Limited time');
  });

  test('it creates a bundle', async function (assert) {
    // @ts-expect-error: There are no types for the Mirage server.
    const requests = trackRequests(this.server);

    // Start from the list, so it's already loaded when the new record is saved.
    await visit('/admin/meat-bundles');
    await click('a[href="/admin/meat-bundles/new"]');
    assert.strictEqual(currentURL(), '/admin/meat-bundles/new');

    await fillIn(`${testId('title')} input`, '40lb Meat Pack');
    await fillIn(`${testId('price')} input`, '$199.99');
    await fillIn(itemInput(0), '10 lbs. Pork Chops');
    await click(buttonWithText('New Item'));
    await fillIn(itemInput(1), '10 lbs. Chicken Wings');
    await click(`${testId('featured')} input`);
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/meat-bundles');
    assert.dom(rowFor('40lb Meat Pack')).includesText('2 Items', 'the new bundle is listed');

    const request = findRequest(requests, 'POST', '/api/meat-bundles');
    assert.ok(request, 'the bundle was created with a POST');
    assert.strictEqual(requestHeader(request!, 'Content-Type'), 'application/vnd.api+json');

    const { data } = JSON.parse(request!.requestBody);
    assert.strictEqual(data.type, 'meat-bundles');
    assert.strictEqual(data.attributes.title, '40lb Meat Pack');
    assert.strictEqual(data.attributes.price, '$199.99');
    assert.deepEqual(data.attributes.items, ['10 lbs. Pork Chops', '10 lbs. Chicken Wings']);
    assert.true(data.attributes.featured);
    assert.false(data.attributes.isHidden, 'the defaults from the new route');
    assert.false(data.attributes.orderEnabled);
  });

  test('a bundle needs at least one item', async function (assert) {
    await visit('/admin/meat-bundles/new');
    await fillIn(`${testId('title')} input`, '40lb Meat Pack');
    await fillIn(`${testId('price')} input`, '$199.99');
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/meat-bundles/new');
    assert.dom(testId('items')).includesText('Please add at least one item');
  });

  test('it edits a bundle', async function (assert) {
    // @ts-expect-error: There are no types for the Mirage server.
    const requests = trackRequests(this.server);

    await visit('/admin/meat-bundles');
    await click(rowFor('20lb Meat Pack').querySelector(testId('edit'))!);

    assert.strictEqual(currentURL(), '/admin/meat-bundles/1/edit');
    assert.dom(itemInput(0)).hasValue('5 lbs. Ground Chuck');
    assert.dom(itemInput(1)).hasValue('5 lbs. Chicken Breast');

    await fillIn(`${testId('price')} input`, '$89.99');
    await fillIn(itemInput(0), '6 lbs. Ground Chuck');
    await click(`${testId('items')} ${testId('item-1')} button`);
    await click('button[type="submit"]');

    assert.strictEqual(currentURL(), '/admin/meat-bundles');
    assert.dom(rowFor('20lb Meat Pack')).includesText('1 Items');

    // @ts-expect-error: There are no types for the Mirage server.
    const saved = this.server.db.meatBundles.find(1) as MirageMeatBundle;
    assert.strictEqual(saved.price, '$89.99');
    assert.deepEqual(saved.items, ['6 lbs. Ground Chuck']);

    const request = findRequest(requests, 'PATCH', '/api/meat-bundles/1');
    assert.ok(request, 'the bundle was saved with a PATCH');
    assert.deepEqual(JSON.parse(request!.requestBody).data.attributes.items, [
      '6 lbs. Ground Chuck',
    ]);
  });

  test('cancelling an edit leaves the bundle unchanged', async function (assert) {
    await visit('/admin/meat-bundles/1/edit');
    await fillIn(`${testId('title')} input`, 'Not saved');
    await fillIn(itemInput(0), 'Not saved either');
    await click(buttonWithText('Cancel'));

    assert.strictEqual(currentURL(), '/admin/meat-bundles');
    assert.dom(rowFor('20lb Meat Pack')).exists();

    // @ts-expect-error: There are no types for the Mirage server.
    const bundle = this.server.db.meatBundles.find(1) as MirageMeatBundle;
    assert.strictEqual(bundle.title, '20lb Meat Pack');
    assert.deepEqual(bundle.items, ['5 lbs. Ground Chuck', '5 lbs. Chicken Breast']);

    await visit('/admin/meat-bundles/1/edit');
    assert.dom(itemInput(0)).hasValue('5 lbs. Ground Chuck', 'the form shows the saved items');
  });

  test('it reorders the bundles', async function (assert) {
    // @ts-expect-error: There are no types for the Mirage server.
    const requests = trackRequests(this.server);

    await visit('/admin/meat-bundles');
    // Drag the second bundle's handle above the first.
    const [first, second] = findAll(testId('meat-bundle'));
    const dy = first!.getBoundingClientRect().top - second!.getBoundingClientRect().top - 2;
    await drag('mouse', `${testId('meat-bundle')}:nth-child(2) ${testId('handle')}`, () => ({
      dx: 0,
      dy,
    }));

    assert.deepEqual(rowTitles(), ['30lb Meat Pack', '20lb Meat Pack']);

    const request = findRequest(requests, 'POST', '/api/meat-bundles/reorder');
    assert.ok(request, 'the order was saved');
    assert.strictEqual(requestHeader(request!, 'Content-Type'), 'text/plain;charset=UTF-8');
    assert.deepEqual(JSON.parse(request!.requestBody), [{ id: '2' }, { id: '1' }]);

    // @ts-expect-error: There are no types for the Mirage server.
    const bundles = this.server.db.meatBundles as { find(id: number): MirageMeatBundle };
    assert.strictEqual(bundles.find(2).displayOrder, 1);
    assert.strictEqual(bundles.find(1).displayOrder, 2);
    assert.dom(testId('server-error')).doesNotExist();
  });

  test('it deletes a bundle', async function (assert) {
    await visit('/admin/meat-bundles');
    await click(rowFor('30lb Meat Pack').querySelector(testId('delete'))!);

    assert.dom(document.body).includesText('Delete Meat Bundle?');
    await click(buttonWithText('Yes'));

    assert.deepEqual(rowTitles(), ['20lb Meat Pack']);
    // @ts-expect-error: There are no types for the Mirage server.
    assert.strictEqual(this.server.db.meatBundles.length, 1);
  });
});
