import { withDefaults, type WithLegacy } from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

export const MeatBundleSchema = withDefaults({
  type: 'meat-bundle',
  fields: [
    { kind: 'attribute', name: 'displayOrder' },
    { kind: 'attribute', name: 'title' },
    { kind: 'attribute', name: 'price' },
    { kind: 'attribute', name: 'featured' },
    { kind: 'attribute', name: 'specialText' },
    { kind: 'attribute', name: 'isHidden' },
    { kind: 'attribute', name: 'orderEnabled' },
    // A plain array: replace it to change it, since changes made inside it aren't tracked.
    { kind: 'attribute', name: 'items' },
    { kind: 'field', name: 'createdAt', type: 'date' },
    { kind: 'field', name: 'updatedAt', type: 'date' },
  ],
});

export type MeatBundle = WithLegacy<{
  displayOrder: number;
  title: string;
  price: string;
  featured: boolean;
  specialText: string;
  isHidden: boolean;
  orderEnabled: boolean;
  items: string[];
  createdAt: Date;
  updatedAt: Date;
  [Type]: 'meat-bundle';
}>;
