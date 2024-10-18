import {
  CompactSelection,
  GridCell,
  GridCellKind,
  Theme as GTheme,
  SizedGridColumn,
} from '@glideapps/glide-data-grid';
import dayjs from 'dayjs';
import _ from 'lodash';

import { formatDatetime } from 'kit/internal/functions';
import { RawJson } from 'kit/internal/types';

import { CHECKBOX_CELL, TEXT_CELL } from './custom-renderers';

export const DEFAULT_COLUMN_WIDTH = 140;
export const MIN_COLUMN_WIDTH = 40;

export const MULTISELECT = 'selected';

export const ColTypes = {
  ARRAY: 'array',
  DATE: 'date',
  NUMBER: 'number',
  TEXT: 'text',
  UNSPECIFIED: 'unspecified',
} as const;

export type ColumnDef<T> = SizedGridColumn & {
  id: string;
  type?: 'number' | 'text' | 'date' | 'array' | 'unspecified';
  renderer: (record: T, idx: number) => GridCell;
  tooltip: (record: T) => string | undefined;
};

export type ColumnDefs<T> = Record<string, ColumnDef<T>>;

export interface HeatmapProps {
  min: number;
  max: number;
}

export function defaultTextColumn<T extends RawJson>(
  columnId: string,
  columnTitle: string,
  columnWidth?: number,
  dataPath?: string,
  columnType?: string,
): ColumnDef<T> {
  return {
    id: columnId,
    renderer: (record) => {
      const getColumnRecordData = () => {
        if (dataPath !== undefined) {
          if (columnType !== undefined) {
            const value = _.get(record, dataPath);

            return columnType === ColTypes.TEXT ? value : undefined;
          }

          return _.get(record, dataPath);
        }

        return undefined;
      };
      const recordData = getColumnRecordData();
      const data = typeof recordData === 'string' ? recordData : undefined;
      return {
        allowOverlay: false,
        copyData: String(data ?? '-'),
        data: { kind: TEXT_CELL },
        kind: GridCellKind.Custom,
      };
    },
    title: columnTitle,
    tooltip: () => undefined,
    type: 'text',
    width: columnWidth ?? DEFAULT_COLUMN_WIDTH,
  };
}

const getHeatmapPercentage = (min: number, max: number, value: number): number => {
  if (min >= max || value >= max) return 1;
  if (value <= min) return 0;
  return (value - min) / (max - min);
};

export const getHeatmapColor = (min: number, max: number, value: number): string => {
  const p = getHeatmapPercentage(min, max, value);
  const red = [44, 222];
  const green = [119, 66];
  const blue = [176, 91];
  return `rgb(${red[0] + (red[1] - red[0]) * p}, ${green[0] + (green[1] - green[0]) * p}, ${
    blue[0] + (blue[1] - blue[0]) * p
  })`;
};

export function defaultNumberColumn<T extends RawJson>(
  columnId: string,
  columnTitle: string,
  columnWidth?: number,
  dataPath?: string,
  heatmapProps?: HeatmapProps,
  columnType?: string,
): ColumnDef<T> {
  return {
    id: columnId,
    renderer: (record) => {
      const getColumnRecordData = () => {
        if (dataPath !== undefined) {
          if (columnType !== undefined) {
            const value = _.get(record, dataPath);

            return columnType === ColTypes.NUMBER ? value : undefined;
          }

          return _.get(record, dataPath);
        }

        return undefined;
      };
      const recordData = getColumnRecordData();
      const data = typeof recordData === 'number' ? recordData : undefined;
      let theme: Partial<GTheme> = {};
      if (heatmapProps && data !== undefined) {
        const { min, max } = heatmapProps;
        theme = {
          accentLight: getHeatmapColor(min, max, data),
          bgCell: getHeatmapColor(min, max, data),
          textDark: 'white',
        };
      }
      return {
        allowOverlay: false,
        copyData: String(data ?? '-'),
        data: { kind: TEXT_CELL },
        kind: GridCellKind.Custom,
        themeOverride: theme,
      };
    },
    title: columnTitle,
    tooltip: () => undefined,
    type: 'number',
    width: columnWidth ?? DEFAULT_COLUMN_WIDTH,
  };
}

export function defaultSelectionColumn<T>(
  rowSelection: CompactSelection,
  selectAll: boolean,
): ColumnDef<T> {
  return {
    icon: selectAll ? 'allSelected' : rowSelection.length ? 'someSelected' : 'noneSelected',
    id: MULTISELECT,
    renderer: (_, idx) => ({
      allowOverlay: false,
      contentAlign: 'left',
      copyData: String(rowSelection.hasIndex(idx)),
      data: {
        checked: rowSelection.hasIndex(idx),
        kind: CHECKBOX_CELL,
      },
      kind: GridCellKind.Custom,
    }),
    themeOverride: { cellHorizontalPadding: 10 },
    title: '',
    tooltip: () => undefined,
    type: 'unspecified',
    width: 40,
  };
}

export function defaultDateColumn<T extends RawJson>(
  columnId: string,
  columnTitle: string,
  columnWidth?: number,
  dataPath?: string,
  columnType?: string,
): ColumnDef<T> {
  return {
    id: columnId,
    renderer: (record) => {
      const getColumnRecordData = () => {
        if (dataPath !== undefined) {
          if (columnType !== undefined) {
            const value = _.get(record, dataPath);

            return columnType === ColTypes.DATE ? value : undefined;
          }

          return _.get(record, dataPath);
        }

        return undefined;
      };
      const recordData = getColumnRecordData();
      const data = dayjs(recordData).isValid() ? recordData : undefined;
      return {
        allowOverlay: false,
        copyData: data ? formatDatetime(String(data), { outputUTC: false }) : '-',
        data: { kind: TEXT_CELL },
        kind: GridCellKind.Custom,
      };
    },
    title: columnTitle,
    tooltip: () => undefined,
    type: 'date',
    width: columnWidth ?? DEFAULT_COLUMN_WIDTH,
  };
}

export function defaultArrayColumn<T extends RawJson>(
  columnId: string,
  columnTitle: string,
  columnWidth?: number,
  dataPath?: string,
  columnType?: string,
): ColumnDef<T> {
  return {
    id: columnId,
    renderer: (record) => {
      const getColumnRecordData = () => {
        if (dataPath !== undefined) {
          if (columnType !== undefined) {
            const value = _.get(record, dataPath);

            return columnType === ColTypes.ARRAY ? value : undefined;
          }

          return _.get(record, dataPath);
        }

        return undefined;
      };
      const recordData = getColumnRecordData();
      const data = Array.isArray(recordData) ? recordData : undefined;
      return {
        allowOverlay: false,
        copyData: data !== undefined ? JSON.stringify(data) : '-',
        data: { kind: TEXT_CELL },
        kind: GridCellKind.Custom,
      };
    },
    title: columnTitle,
    tooltip: () => undefined,
    type: 'array',
    width: columnWidth ?? DEFAULT_COLUMN_WIDTH,
  };
}
