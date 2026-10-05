import { JSONAPISerializer } from '@warp-drive/legacy/serializer/json-api';
import { camelize } from '@ember/string';

export default class ApplicationSerializer extends JSONAPISerializer {
  keyForAttribute(key: string /*, method*/) {
    return camelize(key);
  }
}
