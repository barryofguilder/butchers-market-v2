import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  price: DS.attr('string'),
  featured: DS.attr('boolean'),
  items: DS.attr()
});
