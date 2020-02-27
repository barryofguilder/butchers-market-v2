import { JSONAPISerializer } from 'ember-cli-mirage';
import { camelize } from '@ember/string';

export default JSONAPISerializer.extend({
  keyForAttribute(attr /*, method*/) {
    return camelize(attr);
  },
});
