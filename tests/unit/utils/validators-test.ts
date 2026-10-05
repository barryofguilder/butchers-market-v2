import { module, test } from 'qunit';
import { validateLength, validatePresence } from 'butchers-market/utils/validators';

module('Unit | Utility | validators', function () {
  module('validatePresence', function () {
    test('it fails on empty values', function (assert) {
      const validate = validatePresence();

      assert.strictEqual(validate('title', undefined), "Title can't be blank");
      assert.strictEqual(validate('title', null), "Title can't be blank");
      assert.strictEqual(validate('title', ''), "Title can't be blank");
      assert.strictEqual(validate('items', []), "Items can't be blank");
    });

    test('it passes on present values, including whitespace', function (assert) {
      const validate = validatePresence();

      assert.true(validate('title', 'Ham'));
      assert.true(validate('title', '   '));
      assert.true(validate('items', ['one']));
      assert.true(validate('isHidden', false));
    });

    test('it describes the key in sentence case', function (assert) {
      const validate = validatePresence();

      assert.strictEqual(validate('imageUrl', ''), "Image url can't be blank");
      assert.strictEqual(validate('imageAltText', ''), "Image alt text can't be blank");
      assert.strictEqual(validate('line1', ''), "Line1 can't be blank");
    });

    test('it accepts a description or a whole message', function (assert) {
      assert.strictEqual(
        validatePresence({ description: 'Line 1' })('line1', ''),
        "Line 1 can't be blank"
      );
      assert.strictEqual(
        validatePresence({ message: 'Please add at least one item' })('items', []),
        'Please add at least one item'
      );
    });
  });

  module('validateLength', function () {
    test('it fails when the value is longer than max', function (assert) {
      const validate = validateLength({ max: 50, description: 'Line 2' });

      assert.strictEqual(
        validate('line2', 'x'.repeat(51)),
        'Line 2 is too long (maximum is 50 characters)'
      );
    });

    test('it passes up to max, and on missing values', function (assert) {
      const validate = validateLength({ max: 50 });

      assert.true(validate('line2', 'x'.repeat(50)));
      assert.true(validate('line2', ''));
      assert.true(validate('line2', null));
      assert.true(validate('line2', undefined));
    });
  });
});
