import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('cafe-hours', 'Integration | Component | cafe hours', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{cafe-hours}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#cafe-hours}}
      template block text
    {{/cafe-hours}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
