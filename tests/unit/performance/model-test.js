import { moduleForModel, test } from 'ember-qunit';
import { run } from '@ember/runloop';

moduleForModel('performance', 'Unit | Model | performance', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it can generate the embed link', function(assert) {
  let model = this.subject({
    link: 'https://www.youtube.com/watch?v=8ODVyWKIZMw'
  });

  assert.equal(model.get('embedLink'), 'https://www.youtube.com/embed/8ODVyWKIZMw');

  run(() => model.set('link', 'https://www.youtube.com/watch?v=8cfi5r_7qps&list=PLaUocYlB3j2hIoFGQDlkAwtAE7KcxzhFV&index=1'));

  assert.equal(model.get('embedLink'), 'https://www.youtube.com/embed/8cfi5r_7qps');
});
