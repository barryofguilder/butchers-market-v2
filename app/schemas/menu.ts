import { withDefaults, type WithLegacy } from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

export const MenuSchema = withDefaults({
  type: 'menu',
  fields: [
    { kind: 'attribute', name: 'fileUrl' },
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

export type Menu = WithLegacy<{
  fileUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  readonly fileUrlPath: string | null;
  [Type]: 'menu';
}>;
