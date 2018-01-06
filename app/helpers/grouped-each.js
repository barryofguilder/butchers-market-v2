import { helper } from '@ember/component/helper';
import { A } from '@ember/array';

export function groupedEach(params) {
  let every = params[0];
  let models = params[1];
  let modelLength = models.get('length');
  let newModels = A();
  let rowModels = A();

  for (let i = 0; i < modelLength; i++) {
    if (rowModels.get('length') === every) {
      newModels.pushObject(rowModels);
      rowModels = A();
    }

    rowModels.pushObject(models.objectAt(i));
  }

  if (rowModels.get('length') > 0) {
    newModels.pushObject(rowModels);
  }

  return newModels;
}

export default helper(groupedEach);
