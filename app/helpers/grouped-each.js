import Ember from 'ember';

export function groupedEach(params) {
  let every = params[0];
  let models = params[1];
  let modelLength = models.get('length');

  if (modelLength < every) {
    return models;
  }

  let rows = Math.ceil(modelLength / every);
  let newModels = Ember.A();
  let rowModels = Ember.A();

  for (let i = 0; i < modelLength; i++) {
    if (rowModels.get('length') === every) {
      newModels.pushObject(rowModels);
      rowModels = Ember.A();
    }

    rowModels.pushObject(models.objectAt(i));
  }

  if (rowModels.get('length') > 0) {
    newModels.pushObject(rowModels);
  }

  return newModels;
}

export default Ember.Helper.helper(groupedEach);
