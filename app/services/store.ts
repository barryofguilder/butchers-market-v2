import { useLegacyStore } from '@warp-drive/legacy';
import { JSONAPICache } from '@warp-drive/json-api';
import { setBuildURLConfig } from '@warp-drive/utilities/json-api';
import { AuthHandler } from '../handlers/auth';
import { JsonApiHandler } from '../handlers/json-api';
import { orderOnlineLink, uploadsPath } from '../schemas/derivations';
import { SpecialSchema } from '../schemas/special';
import { DateTransformation } from '../schemas/transformations';
import { API_NAMESPACE, API_URL } from '../utils/config';

setBuildURLConfig({ host: API_URL, namespace: API_NAMESPACE });

const Store = useLegacyStore({
  linksMode: false,
  legacyRequests: true,
  cache: JSONAPICache,
  handlers: [AuthHandler, JsonApiHandler],
  schemas: [SpecialSchema],
  derivations: [orderOnlineLink, uploadsPath],
  transformations: [DateTransformation],
});

type Store = InstanceType<typeof Store>;

export default Store;
