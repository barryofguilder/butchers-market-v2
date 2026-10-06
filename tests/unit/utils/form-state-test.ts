import { module, test } from 'qunit';
import FormState from 'butchers-market/utils/form-state';
import { validateLength, validatePresence } from 'butchers-market/utils/validators';

class Item {
  title = 'Ham';
  notes: string | null = null;
  persistCount = 0;
  failPersist = false;
}

// Stands in for `saveRecord`, counting the calls on the item.
function persist(item: Item) {
  if (item.failPersist) {
    return Promise.reject(new Error('Save failed'));
  }

  item.persistCount++;
  return Promise.resolve();
}

const validations = {
  title: [validatePresence()],
  notes: [validateLength({ max: 5 })],
};

module('Unit | Utility | form-state', function () {
  test('it reads from the model until a field is set', function (assert) {
    const item = new Item();
    const form = new FormState(item, validations, persist);

    assert.strictEqual(form.get('title'), 'Ham');
    assert.strictEqual(form.values.title, 'Ham');

    form.set('title', 'Turkey');

    assert.strictEqual(form.get('title'), 'Turkey');
    assert.strictEqual(form.values.title, 'Turkey');
    assert.strictEqual(item.title, 'Ham', 'the model is untouched');
  });

  test('setting a field validates only that field', function (assert) {
    const form = new FormState(new Item(), validations, persist);

    form.set('title', '');

    assert.true(form.isInvalid);
    assert.deepEqual(form.errors, [
      { key: 'title', validation: ["Title can't be blank"], value: '' },
    ]);

    form.set('title', 'Turkey');

    assert.true(form.isValid);
    assert.deepEqual(form.errors, []);
  });

  test('validate checks every field with validations', function (assert) {
    const item = new Item();
    item.title = '';
    item.notes = 'too long';
    const form = new FormState(item, validations, persist);

    assert.true(form.isValid, 'nothing is validated up front');

    form.validate();

    assert.deepEqual(
      form.errors.map((error) => error.key),
      ['title', 'notes']
    );
  });

  test('addError stays until the key is removed', function (assert) {
    const form = new FormState(new Item(), validations, persist);

    form.addError('image', 'Image URL is required');
    form.validate();

    assert.deepEqual(form.errors, [
      { key: 'image', validation: ['Image URL is required'], value: undefined },
    ]);

    form.removeError('image');

    assert.true(form.isValid);
  });

  test('values has the fields of the model, even when they are undefined', function (assert) {
    const item = new Item() as Item & { extra?: string };
    (item as { notes: unknown }).notes = undefined;
    const form = new FormState(item, validations, persist);

    assert.true('title' in form.values);
    assert.true('notes' in form.values, 'a field that is undefined');
    assert.false('extra' in form.values);

    form.set('extra', 'added');

    assert.true('extra' in form.values, 'a field that has been set');
  });

  test('submit copies the edits onto the model and persists it', async function (assert) {
    const item = new Item();
    const form = new FormState(item, validations, persist);

    form.set('title', 'Turkey');
    await form.submit();

    assert.strictEqual(item.title, 'Turkey');
    assert.strictEqual(item.persistCount, 1);
    assert.strictEqual(form.get('title'), 'Turkey');
  });

  test('a failed submit keeps the edits so the form can be submitted again', async function (assert) {
    const item = new Item();
    item.failPersist = true;
    const form = new FormState(item, validations, persist);

    form.set('title', 'Turkey');

    await assert.rejects(form.submit());
    assert.strictEqual(form.get('title'), 'Turkey');

    item.failPersist = false;
    await form.submit();

    assert.strictEqual(item.title, 'Turkey');
    assert.strictEqual(item.persistCount, 1);
  });
});
