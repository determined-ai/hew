import { isArray } from 'lodash';

export const pluralizer = (
  count: number | unknown[],
  inputString: string,
  plural?: string,
): string => {
  if (count === 1 || (isArray(count) && count.length === 1)) return inputString;
  if (plural) return plural;
  return inputString + 's';
};
