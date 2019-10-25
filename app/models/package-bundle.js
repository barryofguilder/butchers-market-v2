import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  flyerDownloadLink: DS.attr('string'),
  prices: DS.attr(), // Array of strings
  items: DS.attr(), // Array of strings
});
