import { withDefaults, type WithLegacy } from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

export const DeliItemSchema = withDefaults({
  type: 'deli-item',
  fields: [
    { kind: 'attribute', name: 'title' },
    { kind: 'attribute', name: 'imageUrl' },
    { kind: 'attribute', name: 'ingredients' },
    { kind: 'attribute', name: 'isHidden' },
    { kind: 'field', name: 'createdAt', type: 'date' },
    { kind: 'field', name: 'updatedAt', type: 'date' },
    {
      kind: 'derived',
      name: 'imageUrlPath',
      type: 'uploads-path',
      options: { field: 'imageUrl' },
    },
  ],
});

export type DeliItem = WithLegacy<{
  title: string;
  imageUrl: string | null;
  ingredients: string;
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
  readonly imageUrlPath: string | null;
  [Type]: 'deli-item';
}>;
