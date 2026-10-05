import { module, test } from 'qunit';
import FormState from 'butchers-market/utils/form-state';
import { validateLength, validatePresence } from 'butchers-market/utils/validators';

class Item {
  title = 'Ham';
  notes: string | null = null;
  saveCount = 0;
  failSave = false;

  save() {
    if (this.failSave) {
      return Promise.reject(new Error('Save failed'));
    }

    this.saveCount++;
    return Promise.resolve();
  }
}

const validations = {
  title: [validatePresence()],
  notes: [validateLength({ max: 5 })],
};

module('Unit | Utility | form-state', function () {
  test('it reads from the model until a field is set', function (assert) {
    const item = new Item();
    const form = new FormState(item, validations);

    assert.strictEqual(form.get('title'), 'Ham');
    assert.strictEqual(form.values.title, 'Ham');

    form.set('title', 'Turkey');

    assert.strictEqual(form.get('title'), 'Turkey');
    assert.strictEqual(form.values.title, 'Turkey');
    assert.strictEqual(item.title, 'Ham', 'the model is untouched');
  });

  test('setting a field validates only that field', function (assert) {
    const form = new FormState(new Item(), validations);

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
    const form = new FormState(item, validations);

    assert.true(form.isValid, 'nothing is validated up front');

    form.validate();

    assert.deepEqual(
      form.errors.map((error) => error.key),
      ['title', 'notes']
    );
  });

  test('addError stays until the key is removed', function (assert) {
    const form = new FormState(new Item(), validations);

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
    const form = new FormState(item, validations);

    assert.true('title' in form.values);
    assert.true('notes' in form.values, 'a field that is undefined');
    assert.false('extra' in form.values);

    form.set('extra', 'added');

    assert.true('extra' in form.values, 'a field that has been set');
  });

  test('save copies the edits onto the model and saves it', async function (assert) {
    const item = new Item();
    const form = new FormState(item, validations);

    form.set('title', 'Turkey');
    await form.save();

    assert.strictEqual(item.title, 'Turkey');
    assert.strictEqual(item.saveCount, 1);
    assert.strictEqual(form.get('title'), 'Turkey');
  });

  test('save uses the persist function when one is given', async function (assert) {
    const item = new Item();
    const persisted: Item[] = [];
    const form = new FormState(item, validations, (model) => {
      persisted.push(model);
      return Promise.resolve();
    });

    form.set('title', 'Turkey');
    await form.save();

    assert.deepEqual(persisted, [item]);
    assert.strictEqual(item.title, 'Turkey');
    assert.strictEqual(item.saveCount, 0, 'the model save method is not called');
  });

  test('a failed save keeps the edits so the form can be submitted again', async function (assert) {
    const item = new Item();
    item.failSave = true;
    const form = new FormState(item, validations);

    form.set('title', 'Turkey');

    await assert.rejects(form.save());
    assert.strictEqual(form.get('title'), 'Turkey');

    item.failSave = false;
    await form.save();

    assert.strictEqual(item.title, 'Turkey');
    assert.strictEqual(item.saveCount, 1);
  });
});
