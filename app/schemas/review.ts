import { withDefaults, type WithLegacy } from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

export const ReviewSchema = withDefaults({
  type: 'review',
  fields: [
    { kind: 'attribute', name: 'reviewer' },
    { kind: 'attribute', name: 'imageUrl' },
    { kind: 'attribute', name: 'text' },
    { kind: 'attribute', name: 'source' },
    { kind: 'attribute', name: 'url' },
    { kind: 'field', name: 'createdAt', type: 'date' },
    { kind: 'field', name: 'updatedAt', type: 'date' },
  ],
});

export type Review = WithLegacy<{
  reviewer: string;
  imageUrl: string;
  text: string;
  source: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  [Type]: 'review';
}>;
