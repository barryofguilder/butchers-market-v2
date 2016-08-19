import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('stellar-parallax', 'Integration | Component | stellar parallax', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{stellar-parallax}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#stellar-parallax}}
      template block text
    {{/stellar-parallax}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
