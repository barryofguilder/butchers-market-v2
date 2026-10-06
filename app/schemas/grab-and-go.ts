import { withDefaults, type WithLegacy } from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

export const GrabAndGoSchema = withDefaults({
  type: 'grab-and-go',
  fields: [
    { kind: 'attribute', name: 'title' },
    { kind: 'attribute', name: 'socialTitle' },
    { kind: 'attribute', name: 'imageUrl' },
    { kind: 'attribute', name: 'description' },
    { kind: 'attribute', name: 'inStock', options: { defaultValue: false } },
    { kind: 'attribute', name: 'isHoliday' },
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

export type GrabAndGo = WithLegacy<{
  title: string;
  socialTitle: string | null;
  imageUrl: string | null;
  description: string;
  inStock: boolean;
  isHoliday: boolean;
  createdAt: Date;
  updatedAt: Date;
  readonly imageUrlPath: string | null;
  [Type]: 'grab-and-go';
}>;
