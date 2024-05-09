import { module, test } from 'qunit';
import { setupRenderingTest } from 'butchers-market/tests/helpers';
import { type TestContext, click, render, waitFor } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { timeout } from 'ember-concurrency';
import type { Task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { testId } from 'butchers-market/tests/helpers/test-id';
import { TaskHelper } from 'butchers-market/tests/helpers/task-helper';

class ButtonContext {
  @tracked isRunning = true;
}
interface Context extends TestContext {
  myAction?: (event: Event) => unknown;
  myPromise?: (event: Event) => Promise<void>;
  myTask?: Task<void, []>;
  buttonContext?: ButtonContext;
}

module('Integration | Component | ui-button', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders with the defaults', async function (assert) {
    await render(hbs`<UiButton>Default Button</UiButton>`);

    assert.dom(testId('button')).hasClass('bg-gray-800', 'has correct background color');
    assert.dom(testId('button')).hasAttribute('type', 'button', 'has correct type');
    assert.dom(testId('button')).doesNotHaveAttribute('disabled', 'is not disabled');
    assert.dom(testId('button')).hasText('Default Button', 'has correct text');
    assert.dom(testId('button')).doesNotHaveAttribute('href');
    assert.dom(testId('button')).doesNotHaveAttribute('download');
    assert.dom(testId('button', 'button-icon')).doesNotExist('no icon is rendered');
  });

  test('it renders a primary button', async function (assert) {
    await render(hbs`<UiButton @variant="primary">Primary Button</UiButton>`);

    assert.dom(testId('button')).hasClass('bg-red-800', 'has correct background color');
    assert.dom(testId('button')).hasAttribute('type', 'button', 'has correct type');
    assert.dom(testId('button')).doesNotHaveAttribute('disabled', 'is not disabled');
    assert.dom(testId('button')).hasText('Primary Button', 'has correct text');
  });

  test('it renders a secondary button', async function (assert) {
    await render(hbs`<UiButton @variant="secondary">Secondary Button</UiButton>`);

    assert.dom(testId('button')).hasClass('bg-gray-800', 'has correct background color');
    assert.dom(testId('button')).hasAttribute('type', 'button', 'has correct type');
    assert.dom(testId('button')).doesNotHaveAttribute('disabled', 'is not disabled');
    assert.dom(testId('button')).hasText('Secondary Button', 'has correct text');
  });

  test('it renders a plain button', async function (assert) {
    await render(hbs`<UiButton @variant="plain">Plain Button</UiButton>`);

    assert.dom(testId('button')).hasClass('bg-transparent', 'has correct background color');
    assert.dom(testId('button')).hasAttribute('type', 'button', 'has correct type');
    assert.dom(testId('button')).doesNotHaveAttribute('disabled', 'is not disabled');
    assert.dom(testId('button')).hasText('Plain Button', 'has correct text');
  });

  test('it renders with custom HTML attributes', async function (assert) {
    await render(hbs`
      <UiButton data-test-id="my-button" aria-disabled="true" type="submit">
        My Button
      </UiButton>
    `);

    assert.dom(testId('my-button')).exists();
    assert.dom(testId('my-button')).hasAttribute('aria-disabled', 'true');
    assert.dom(testId('my-button')).hasAttribute('type', 'submit');
  });

  test('it can render with an icon', async function (assert) {
    await render(hbs`<UiButton @icon="fire">Edit</UiButton>`);

    assert.dom(testId('button')).hasText('Edit', 'has correct text');
    assert.dom(testId('button', 'button-icon')).exists('an icon is rendered');
  });

  test('it can render as a different type using the component argument', async function (assert) {
    await render(hbs`<UiButton @type="submit">Submit Button</UiButton>`);

    assert.dom(testId('button')).hasAttribute('type', 'submit');
  });

  test('it can fire an action', async function (this: Context, assert) {
    this.myAction = function () {
      assert.step('button clicked');
    };

    await render<Context>(hbs`<UiButton @onClick={{this.myAction}}>My Button</UiButton>`);
    await click(testId('button'));

    assert.verifySteps(['button clicked']);
  });

  test('it has the disabled attribute when set to disabled', async function (this: Context, assert) {
    await render<Context>(
      hbs`<UiButton @onClick={{this.myAction}} @disabled={{true}}>My Button</UiButton>`,
    );

    assert.dom(testId('button')).isDisabled();
  });

  test('it does not show the loading indicator when a non-promise is passed into the `onClick` argument', async function (this: Context, assert) {
    this.myAction = function () {
      //
    };

    await render<Context>(hbs`<UiButton @onClick={{this.myAction}}>My Button</UiButton>`);
    click(testId('button'));

    assert.dom(testId('is-running')).doesNotExist();
  });

  test('a Promise can be passed to the `onClick` argument', async function (this: Context, assert) {
    this.myPromise = async function () {
      assert.step('button clicked');
      await timeout(1);
    };

    await render<Context>(hbs`<UiButton @onClick={{this.myPromise}}>My Button</UiButton>`);
    await click(testId('button'));

    assert.verifySteps(['button clicked']);
  });

  test('it shows a loading spinner and is disabled when clicking with a promise based `onClick` argument', async function (this: Context, assert) {
    const helper = new TaskHelper();
    this.myTask = helper.task;

    await render<Context>(
      hbs`
        <UiButton @onClick={{perform this.myTask}}>My Button</UiButton>
      `,
    );
    await click(testId('button'));

    await waitFor(testId('is-running'));
    assert.dom(testId('is-running')).exists();
    assert.dom(testId('button')).isDisabled();

    helper.finishTask();

    await waitFor(testId('is-running'), { count: 0 });
    assert.dom(testId('is-running')).doesNotExist();
    assert.dom(testId('button')).isNotDisabled();
  });

  test('it renders as a link when using the `href` argument', async function (assert) {
    await render(hbs`
      <UiButton @href="https://google.com">Google</UiButton>
    `);

    assert.dom(testId('button')).hasText('Google');
    assert.dom(testId('button')).hasAttribute('href', 'https://google.com');
    assert.dom(testId('button')).doesNotHaveAttribute('download');
  });

  test('it has the `download` attribute', async function (assert) {
    await render(hbs`
      <UiButton @href="foo.txt" @download={{true}}>My File</UiButton>
    `);

    assert.dom(testId('button')).hasAttribute('download', 'true');
  });

  test('it renders as a link when using the `route` argument', async function (assert) {
    await render(hbs`<UiButton @route='test-route'>Test Route</UiButton>`);

    assert.dom(testId('button')).hasText('Test Route');
    assert.dom(testId('button')).hasAttribute('href', '/test-route');
    assert.dom(testId('button')).doesNotHaveAttribute('download');
  });

  test('it correctly renders the href for a route with a model', async function (assert) {
    await render(hbs`
      <UiButton @route='test-route.model-route' @model={{1}}>
        Test Model Route
      </UiButton>
    `);

    assert.dom(testId('button')).hasAttribute('href', '/test-route/1');
  });

  test('it correctly renders the `href` for a route with multiple models', async function (assert) {
    await render(hbs`
      <UiButton
        @route='test-route.model-route.second-model-route'
        @models={{array 1 'foo'}}
      >
        Test Route
      </UiButton>
    `);

    assert.dom(testId('button')).hasAttribute('href', '/test-route/1/tag/foo');
  });

  test('it correctly renders the `href` for a route with query params', async function (assert) {
    await render(hbs`
      <UiButton @route='test-route' @query={{hash search='foo'}}>
        Test Route
      </UiButton>
    `);

    assert.dom(testId('button')).hasAttribute('href', '/test-route?search=foo');
  });
});
