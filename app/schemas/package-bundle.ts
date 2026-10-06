import { withDefaults, type WithLegacy } from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

export const PackageBundleSchema = withDefaults({
  type: 'package-bundle',
  fields: [
    { kind: 'attribute', name: 'displayOrder' },
    { kind: 'attribute', name: 'title' },
    { kind: 'attribute', name: 'fileUrl' },
    { kind: 'attribute', name: 'specialText' },
    // Plain arrays: replace them to change them, since changes made inside them aren't tracked.
    { kind: 'attribute', name: 'prices' },
    { kind: 'attribute', name: 'items' },
    { kind: 'field', name: 'createdAt', type: 'date' },
    { kind: 'field', name: 'updatedAt', type: 'date' },
    {
      kind: 'derived',
      name: 'fileUrlPath',
      type: 'uploads-path',
      options: { field: 'fileUrl' },
    },
  ],
});

export type PackageBundle = WithLegacy<{
  displayOrder: number;
  title: string;
  fileUrl: string | null;
  specialText: string;
  prices: string[];
  items: string[];
  createdAt: Date;
  updatedAt: Date;
  readonly fileUrlPath: string | null;
  [Type]: 'package-bundle';
}>;
