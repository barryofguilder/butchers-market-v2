import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | performance', function (hooks) {
  setupTest(hooks);

  test('it can generate the embed link', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('performance', {
      link: 'https://www.youtube.com/watch?v=8ODVyWKIZMw',
    });

    assert.equal(model.embedLink, 'https://www.youtube.com/embed/8ODVyWKIZMw');

    model.link =
      'https://www.youtube.com/watch?v=8cfi5r_7qps&list=PLaUocYlB3j2hIoFGQDlkAwtAE7KcxzhFV&index=1';

    assert.equal(model.embedLink, 'https://www.youtube.com/embed/8cfi5r_7qps');
  });
});
