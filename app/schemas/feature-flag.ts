import { withDefaults, type WithLegacy } from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

export const FeatureFlagSchema = withDefaults({
  type: 'feature-flag',
  fields: [
    { kind: 'attribute', name: 'name' },
    { kind: 'attribute', name: 'active' },
    { kind: 'field', name: 'createdAt', type: 'date' },
    { kind: 'field', name: 'updatedAt', type: 'date' },
  ],
});

export type FeatureFlag = WithLegacy<{
  name: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  [Type]: 'feature-flag';
}>;
