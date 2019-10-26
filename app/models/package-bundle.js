import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  displayOrder: DS.attr('number'),
  flyerDownloadLink: DS.attr('string'),
  prices: DS.attr(), // Array of strings
  items: DS.attr(), // Array of strings
});
