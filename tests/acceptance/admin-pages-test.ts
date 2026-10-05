import { module, test } from 'qunit';
import { currentURL, settled, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'butchers-market/tests/helpers';
import { setupAuthentication } from 'butchers-market/tests/helpers/authenticate';
import seedDefaultScenario from 'butchers-market/mirage/scenarios/default';

interface AdminPage {
  /**
   * The Mirage collection the resource is stored in, used to find an id for the edit page.
   */
  collection: string;
  path: string;
  indexTitle: string;
  newTitle?: string;
  editTitle: string;
}

const PAGES: AdminPage[] = [
  {
    collection: 'deliItems',
    path: 'deli-items',
    indexTitle: 'Deli Items',
    newTitle: 'New Deli Item',
    editTitle: 'Edit Deli Item',
  },
  {
    collection: 'featureFlags',
    path: 'feature-flags',
    indexTitle: 'Feature Flags',
    newTitle: 'New Feature Flag',
    editTitle: 'Edit Feature Flag',
  },
  {
    collection: 'grabAndGos',
    path: 'grab-and-go',
    indexTitle: 'Grab and Go',
    newTitle: 'New Grab and Go',
    editTitle: 'Edit Grab and Go',
  },
  {
    collection: 'hours',
    path: 'hours',
    indexTitle: 'Store Hours',
    newTitle: 'New Hours',
    editTitle: 'Edit Hours',
  },
  {
    collection: 'meatBundles',
    path: 'meat-bundles',
    indexTitle: 'Meat Bundles',
    newTitle: 'New Meat Bundle',
    editTitle: 'Edit Meat Bundle',
  },
  {
    collection: 'menus',
    path: 'menu',
    indexTitle: 'Menu PDF',
    editTitle: 'Edit Menu PDF',
  },
  {
    collection: 'packageBundles',
    path: 'package-bundles',
    indexTitle: 'Package Bundles',
    newTitle: 'New Package Bundle',
    editTitle: 'Edit Package Bundle',
  },
  {
    collection: 'specials',
    path: 'specials',
    indexTitle: 'Specials',
    newTitle: 'New Special',
    editTitle: 'Edit Special',
  },
];

// Smoke tests: every admin page loads its data and renders. Workflows that save data are covered
// per resource in `tests/acceptance/admin/`.
module('Acceptance | admin pages', function (hooks) {
  setupApplicationTest(hooks);

  test('the admin requires signing in', async function (assert) {
    try {
      await visit('/admin');
    } catch (error) {
      // The `admin` route aborts the transition before redirecting to sign-in.
      if ((error as Error).message !== 'TransitionAborted') {
        throw error;
      }
    }
    await settled();

    assert.strictEqual(currentURL(), '/sign-in');
  });

  module('signed in', function (hooks) {
    setupAuthentication(hooks);

    hooks.beforeEach(function () {
      // @ts-expect-error: There are no types for the Mirage server.
      seedDefaultScenario(this.server);
      // The default scenario doesn't create any feature flags.
      // @ts-expect-error: There are no types for the Mirage server.
      this.server.create('feature-flag', { name: 'smoke-test', activate: true });
    });

    test('the admin home page renders', async function (assert) {
      await visit('/admin');

      assert.strictEqual(currentURL(), '/admin');
      assert.dom('h1').hasText('Manage');
    });

    test('the grab and go social page renders', async function (assert) {
      await visit('/admin/grab-and-go/social');

      assert.strictEqual(currentURL(), '/admin/grab-and-go/social');
      assert.dom('h1').hasText('Grab and Go - Social Titles');
      assert.dom(document.body).includesText('Original meatloaf', 'an item that is in stock');
    });

    for (const page of PAGES) {
      test(`the ${page.path} index page renders`, async function (assert) {
        await visit(`/admin/${page.path}`);

        assert.strictEqual(currentURL(), `/admin/${page.path}`);
        assert.dom('h1').hasText(page.indexTitle);
      });

      test(`the ${page.path} edit page renders`, async function (assert) {
        // @ts-expect-error: There are no types for the Mirage server.
        const record = this.server.db[page.collection][0];

        await visit(`/admin/${page.path}/${record.id}/edit`);

        assert.strictEqual(currentURL(), `/admin/${page.path}/${record.id}/edit`);
        assert.dom('h1').hasText(page.editTitle);
      });
    }

    for (const page of PAGES.filter((page) => page.newTitle)) {
      test(`the ${page.path} new page renders`, async function (assert) {
        await visit(`/admin/${page.path}/new`);

        assert.strictEqual(currentURL(), `/admin/${page.path}/new`);
        assert.dom('h1').hasText(page.newTitle!);
      });
    }
  });
});
