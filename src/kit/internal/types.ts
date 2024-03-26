import * as t from 'io-ts';

import { ValueOf } from 'kit/utils/types';

export type Primitive = boolean | number | string;
export type RecordKey = string | number | symbol;
export type NullOrUndefined<T = undefined> = T | null | undefined;
export type Range<T = Primitive> = [T, T];

// DEPRECATED
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type RawJson = Record<string, any>;

export const Scale = {
  Linear: 'linear',
  Log: 'log',
} as const;

export type Scale = ValueOf<typeof Scale>;

interface EndTimes {
  endTime?: string;
}

export const CheckpointState = {
  Active: 'ACTIVE',
  Completed: 'COMPLETED',
  Deleted: 'DELETED',
  Error: 'ERROR',
  PartiallyDeleted: 'PARTIALLY_DELETED',
  Unspecified: 'UNSPECIFIED',
} as const;

export type CheckpointState = ValueOf<typeof CheckpointState>;

interface BaseWorkload extends EndTimes {
  totalBatches: number;
}
interface CheckpointWorkload extends BaseWorkload {
  resources?: Record<string, number>;
  state: CheckpointState;
  uuid?: string;
}
interface CheckpointWorkloadExtended extends CheckpointWorkload {
  experimentId: number;
  trialId: number;
}

export type XAxisVal = number;
export type CheckpointsDict = Record<XAxisVal, CheckpointWorkloadExtended>;

export interface SettingsConfigProp<A> {
  defaultValue: A;
  skipUrlEncoding?: boolean;
  storageKey: string;
  type: t.Type<A>;
}
export interface SettingsConfig<T> {
  settings: { [K in keyof T]: SettingsConfigProp<T[K]> };
  storagePath: string;
}

export interface FetchArgs {
  url: string;
  // eslint-disable-next-line
  options: any;
}

/**
 * DarkLight is a resolved form of `Mode` where we figure out
 * what `Mode.System` should ultimate resolve to (`Dark` vs `Light).
 */
export const DarkLight = {
  Dark: 'dark',
  Light: 'light',
} as const;

export type DarkLight = ValueOf<typeof DarkLight>;
export interface ClassNameProp {
  /** classname to be applied to the base element */
  className?: string;
}

export type AnyMouseEvent = MouseEvent | React.MouseEvent;
export type AnyMouseEventHandler = (event: AnyMouseEvent) => void;

export interface Document {
  contents: string;
  name: string;
}

export interface User {
  displayName?: string;
  id: number;
  modifiedAt?: number;
  username: string;
}

export const LogLevel = {
  Critical: 'critical',
  Debug: 'debug',
  Error: 'error',
  Info: 'info',
  None: 'none',
  Trace: 'trace',
  Warning: 'warning',
} as const;

export type LogLevel = ValueOf<typeof LogLevel>;

// Disable `sort-keys` to sort LogLevel by higher severity levels
export const LogLevelFromApi = {
  Critical: 'LOG_LEVEL_CRITICAL',
  Error: 'LOG_LEVEL_ERROR',
  Warning: 'LOG_LEVEL_WARNING',
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  Info: 'LOG_LEVEL_INFO',
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  Debug: 'LOG_LEVEL_DEBUG',
  Trace: 'LOG_LEVEL_TRACE',
  Unspecified: 'LOG_LEVEL_UNSPECIFIED',
} as const;

export type LogLevelFromApi = ValueOf<typeof LogLevelFromApi>;

export interface Log {
  id: number | string;
  level?: LogLevel;
  message: string;
  meta?: string;
  time: string;
}

export interface SsoProvider {
  name: string;
  ssoUrl: string;
}

export const BrandingType = {
  Determined: 'determined',
  HPE: 'hpe',
} as const;

export type BrandingType = ValueOf<typeof BrandingType>;

export const RunState = {
  Active: 'ACTIVE',
  Canceled: 'CANCELED',
  Completed: 'COMPLETED',
  Deleted: 'DELETED',
  DeleteFailed: 'DELETE_FAILED',
  Deleting: 'DELETING',
  Error: 'ERROR',
  Paused: 'PAUSED',
  Pulling: 'PULLING',
  Queued: 'QUEUED',
  Running: 'RUNNING',
  Starting: 'STARTING',
  StoppingCanceled: 'STOPPING_CANCELED',
  StoppingCompleted: 'STOPPING_COMPLETED',
  StoppingError: 'STOPPING_ERROR',
  StoppingKilled: 'STOPPING_KILLED',
  Unspecified: 'UNSPECIFIED',
} as const;

export type RunState = ValueOf<typeof RunState>;

/* Command */
export const CommandState = {
  Pulling: 'PULLING',
  Queued: 'QUEUED',
  Running: 'RUNNING',
  Starting: 'STARTING',
  Terminated: 'TERMINATED',
  Terminating: 'TERMINATING',
  Waiting: 'WAITING',
} as const;

export type CommandState = ValueOf<typeof CommandState>;

// TODO: we might have to keep updaing it as the Api.Jobv1State changes...
export const JobState = {
  QUEUED: 'STATE_QUEUED',
  SCHEDULED: 'STATE_SCHEDULED',
  SCHEDULEDBACKFILLED: 'STATE_SCHEDULED_BACKFILLED',
  UNSPECIFIED: 'STATE_UNSPECIFIED',
} as const;

export type JobState = ValueOf<typeof JobState>;

export const ResourceState = {
  // This is almost CommandState
  Assigned: 'ASSIGNED',
  Potential: 'POTENTIAL',
  Pulling: 'PULLING',
  Running: 'RUNNING',
  Starting: 'STARTING',
  Terminated: 'TERMINATED',
  Unspecified: 'UNSPECIFIED',
  Warm: 'WARM',
} as const;

export type ResourceState = ValueOf<typeof ResourceState>;

// High level Slot state
export const SlotState = {
  Free: 'FREE',
  Pending: 'PENDING',
  Potential: 'POTENTIAL',
  Running: 'RUNNING',
} as const;

export type SlotState = ValueOf<typeof SlotState>;

export const WorkspaceState = {
  Deleted: 'DELETED',
  DeleteFailed: 'DELETE_FAILED',
  Deleting: 'DELETING',
  Unspecified: 'UNSPECIFIED',
} as const;

export type WorkspaceState = ValueOf<typeof WorkspaceState>;

/**
 * @typedef Serie
 * Represents a single Series to display on the chart.
 * @param {string} [color] - A CSS-compatible color to directly set the line and tooltip color for the Serie. Defaults to glasbeyColor.
 * @param {Partial<Record<XAxisDomain, [x: number, y: number][]>>} data - An array of ordered [x, y] points for each axis.
 * @param {string} [name] - Name to display in legend and toolip instead of Series number.
 */

export interface Serie {
  color?: string;
  data: Partial<Record<XAxisDomain, [x: number, y: number][]>>;
  key?: number;
  name?: string;
}

export const XAxisDomain = {
  Batches: 'Batches',
  Epochs: 'Epoch',
  Time: 'Time',
} as const;

export type XAxisDomain = ValueOf<typeof XAxisDomain>;
