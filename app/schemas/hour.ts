import { withDefaults, type WithLegacy } from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

export type HourType = 'Store' | 'Cafe';

export const HourSchema = withDefaults({
  type: 'hour',
  fields: [
    // `type` is an attribute here: whether these are store or cafe hours.
    { kind: 'attribute', name: 'type', options: { defaultValue: 'Store' } },
    { kind: 'attribute', name: 'default' },
    { kind: 'field', name: 'activeStartDate', type: 'date' },
    { kind: 'field', name: 'activeEndDate', type: 'date' },
    { kind: 'attribute', name: 'label' },
    { kind: 'attribute', name: 'line1' },
    { kind: 'attribute', name: 'line2' },
    { kind: 'attribute', name: 'line3' },
    { kind: 'field', name: 'createdAt', type: 'date' },
    { kind: 'field', name: 'updatedAt', type: 'date' },
  ],
});

export type Hour = WithLegacy<{
  type: HourType;
  default: boolean;
  activeStartDate: Date;
  activeEndDate: Date;
  label: string;
  line1: string;
  line2: string;
  line3: string;
  createdAt: Date;
  updatedAt: Date;
  [Type]: 'hour';
}>;
