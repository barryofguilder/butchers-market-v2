import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('iphone-carousel-item', 'Integration | Component | iphone carousel item', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{iphone-carousel-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#iphone-carousel-item}}
      template block text
    {{/iphone-carousel-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
