import { withDefaults, type WithLegacy } from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

export const SpecialSchema = withDefaults({
  type: 'special',
  fields: [
    { kind: 'attribute', name: 'title' },
    { kind: 'attribute', name: 'link' },
    { kind: 'attribute', name: 'displayOrder' },
    { kind: 'attribute', name: 'imageUrl' },
    { kind: 'attribute', name: 'imageAltText' },
    { kind: 'field', name: 'activeStartDate', type: 'date' },
    { kind: 'field', name: 'activeEndDate', type: 'date' },
    { kind: 'attribute', name: 'inStock', options: { defaultValue: false } },
    { kind: 'attribute', name: 'isHidden' },
    { kind: 'field', name: 'createdAt', type: 'date' },
    { kind: 'field', name: 'updatedAt', type: 'date' },
    {
      kind: 'derived',
      name: 'renderLink',
      type: 'order-online-link',
      options: { field: 'link' },
    },
    {
      kind: 'derived',
      name: 'imageUrlPath',
      type: 'uploads-path',
      options: { field: 'imageUrl' },
    },
  ],
});

export type Special = WithLegacy<{
  title: string;
  link: string;
  displayOrder: number;
  imageUrl: string | null;
  imageAltText: string;
  activeStartDate: Date | null;
  activeEndDate: Date | null;
  inStock: boolean;
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
  readonly renderLink: string;
  readonly imageUrlPath: string | null;
  [Type]: 'special';
}>;
