import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('iphone-carousel', 'Integration | Component | iphone carousel', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{iphone-carousel}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#iphone-carousel}}
      template block text
    {{/iphone-carousel}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
