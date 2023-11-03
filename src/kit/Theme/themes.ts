/* eslint-disable sort-keys-fix/sort-keys-fix */
import { isColor, rgba2str, rgbaMix, str2rgba } from 'kit/internal/color';
import { themeDark, themeLight } from 'kit/internal/Theme/theme';
import {
  CheckpointState,
  CommandState,
  JobState,
  ResourceState,
  RunState,
  SlotState,
  WorkspaceState,
} from 'kit/internal/types';
import { ValueOf } from 'kit/utils/types';

import { Theme, themeBase } from './themeUtils';

/*const STRONG_WEAK_DELTA = 45;
 * Where did we get our sizes from?
 * https://www.quora.com/What-is-the-difference-among-big-large-huge-enormous-and-giant
 */
export const ShirtSize = {
  Small: 'small',
  Medium: 'medium',
  Large: 'large',
} as const;

export type { Theme };
export type ShirtSize = ValueOf<typeof ShirtSize>;

export type DefaultTheme = ValueOf<typeof DefaultTheme>;

const STRONG_WEAK_DELTA = 45;

const generateStrongWeak = (theme: Theme): Theme => {
  const rgbaStrong = str2rgba(theme.strong);
  const rgbaWeak = str2rgba(theme.weak);

  for (const [key, value] of Object.entries(theme)) {
    const matches = key.match(/^(.+)(Strong|Weak)$/);
    if (matches?.length === 3 && value === undefined) {
      const isStrong = matches[2] === 'Strong';
      const baseKey = matches[1] as keyof Theme;
      const baseValue = theme[baseKey];
      if (baseValue && isColor(baseValue)) {
        const rgba = str2rgba(baseValue);
        const mixer = isStrong ? rgbaStrong : rgbaWeak;
        theme[key as keyof Theme] = rgba2str(rgbaMix(rgba, mixer, STRONG_WEAK_DELTA));
      }
    }
  }
  return theme as Theme;
};

const themeLightDetermined: Theme = generateStrongWeak(Object.assign({}, themeBase, themeLight));
const themeDarkDetermined: Theme = generateStrongWeak(Object.assign({}, themeBase, themeDark));
const themeHpe = { brand: 'rgba(1, 169, 130, 1.0)' };

const themeLightHpe: Theme = generateStrongWeak(Object.assign({}, themeBase, themeLight, themeHpe));
const themeDarkHpe: Theme = generateStrongWeak(Object.assign({}, themeBase, themeDark, themeHpe));

export const DefaultTheme = {
  Light: themeLightDetermined,
  Dark: themeDarkDetermined,
  HPELight: themeLightHpe,
  HPEDark: themeDarkHpe,
} as const;

const stateColorMapping = {
  [RunState.Active]: 'active',
  [RunState.Canceled]: 'inactive',
  [RunState.Completed]: 'success',
  [RunState.Deleted]: 'critical',
  [RunState.Deleting]: 'critical',
  [RunState.DeleteFailed]: 'critical',
  [RunState.Error]: 'critical',
  [RunState.Paused]: 'warning',
  [RunState.StoppingCanceled]: 'inactive',
  [RunState.StoppingCompleted]: 'success',
  [RunState.StoppingError]: 'critical',
  [RunState.StoppingKilled]: 'killed',
  [CheckpointState.PartiallyDeleted]: 'warning',
  [RunState.Unspecified]: 'inactive',
  [RunState.Queued]: 'warning',
  [RunState.Pulling]: 'pending',
  [RunState.Starting]: 'pending',
  [RunState.Running]: 'active',
  [CommandState.Waiting]: 'inactive',
  [CommandState.Pulling]: 'active',
  [CommandState.Starting]: 'active',
  [CommandState.Running]: 'active',
  [CommandState.Terminating]: 'inactive',
  [CommandState.Terminated]: 'inactive',
  [ResourceState.Unspecified]: 'inactive',
  [ResourceState.Running]: 'active',
  [ResourceState.Assigned]: 'pending',
  [ResourceState.Pulling]: 'pending',
  [ResourceState.Starting]: 'pending',
  [ResourceState.Warm]: 'free',
  [SlotState.Free]: 'free',
  [SlotState.Pending]: 'pending',
  [SlotState.Running]: 'active',
  [SlotState.Potential]: 'potential',
  [JobState.SCHEDULED]: 'active',
  [JobState.SCHEDULEDBACKFILLED]: 'active',
  [JobState.QUEUED]: 'warning',
  [JobState.UNSPECIFIED]: 'inactive',
};

export type StateOfUnion =
  | RunState
  | CommandState
  | ResourceState
  | CheckpointState
  | SlotState
  | JobState
  | WorkspaceState;

export const getStateColorCssVar = (
  state: StateOfUnion | undefined,
  options: { isOn?: boolean; strongWeak?: 'strong' | 'weak' } = {},
): string => {
  const name = state ? stateColorMapping[state] : 'active';
  const on = options.isOn ? '-on' : '';
  const strongWeak = options.strongWeak ? `-${options.strongWeak}` : '';
  return `var(--theme-status-${name}${on}${strongWeak})`;
};
