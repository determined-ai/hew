export const floatToPercent = (num: number, precision = 2): string => {
  if (isNaN(num)) return 'NaN';
  if (num === Infinity) return 'Infinity';
  if (num === -Infinity) return '-Infinity';
  return (num * 100).toFixed(precision) + '%';
};
