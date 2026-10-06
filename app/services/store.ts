import { useLegacyStore } from '@warp-drive/legacy';
import { JSONAPICache } from '@warp-drive/json-api';
import { setBuildURLConfig } from '@warp-drive/utilities/json-api';
import { AuthHandler } from '../handlers/auth';
import { JsonApiHandler } from '../handlers/json-api';
import { orderOnlineLink, uploadsPath } from '../schemas/derivations';
import { DeliItemSchema } from '../schemas/deli-item';
import { FeatureFlagSchema } from '../schemas/feature-flag';
import { GrabAndGoSchema } from '../schemas/grab-and-go';
import { HourSchema } from '../schemas/hour';
import { MenuSchema } from '../schemas/menu';
import { ReviewSchema } from '../schemas/review';
import { SpecialSchema } from '../schemas/special';
import { DateTransformation } from '../schemas/transformations';
import { API_NAMESPACE, API_URL } from '../utils/config';

setBuildURLConfig({ host: API_URL, namespace: API_NAMESPACE });

const Store = useLegacyStore({
  linksMode: false,
  legacyRequests: true,
  cache: JSONAPICache,
  handlers: [AuthHandler, JsonApiHandler],
  schemas: [
    DeliItemSchema,
    FeatureFlagSchema,
    GrabAndGoSchema,
    HourSchema,
    MenuSchema,
    ReviewSchema,
    SpecialSchema,
  ],
  derivations: [orderOnlineLink, uploadsPath],
  transformations: [DateTransformation],
});

type Store = InstanceType<typeof Store>;

export default Store;
