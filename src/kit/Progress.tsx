import React from 'react';

import { ShirtSize, Spacing, useTheme } from 'kit/Theme';
import Tooltip from 'kit/Tooltip';

import css from './Progress.module.scss';

export interface BarPart {
  bordered?: string;
  color: string; // css color
  label?: string;
  percent: number; // between 0-1
}

export interface Props {
  flat?: boolean;
  parts: BarPart[];
  showLegend?: boolean;
  showTooltips?: boolean;
  size?: ShirtSize;
  title?: string;
}

const floatToPercent = (num: number, precision = 2): string => {
  if (isNaN(num)) return 'NaN';
  if (num === Infinity) return 'Infinity';
  if (num === -Infinity) return '-Infinity';
  return (num * 100).toFixed(precision) + '%';
};

const partStyle = (part: BarPart) => ({
  backgroundColor: part.color,
  width: floatToPercent(part.percent, 0),
});

const sizeMap = {
  [ShirtSize.Small]: Spacing.Xs,
  [ShirtSize.Medium]: Spacing.Lg,
  [ShirtSize.Large]: Spacing.Xl3,
};

const Progress: React.FC<Props> = ({
  flat,
  parts,
  showLegend,
  showTooltips,
  size = ShirtSize.Small,
  title,
}: Props) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes: string[] = [css.base, themeClass];

  if (flat) classes.push(css.flat);

  return (
    <>
      {title && <h5 className={css.title}>{title}</h5>}
      <div className={classes.join(' ')}>
        <div
          className={css.bar}
          style={{ height: `calc(${sizeMap[size]} + var(--theme-density) * 1px)` }}>
          <div className={css.parts}>
            {parts
              .filter((part) => part.percent !== 0 && !isNaN(part.percent))
              .map((part, idx) => (
                <Tooltip content={showTooltips && part.label} key={idx}>
                  <li
                    style={{
                      ...partStyle(part),
                      cursor: showTooltips && part.label ? 'pointer' : '',
                    }}
                    aria-label={part.label}
                    aria-valuemin={0}
                    aria-valuemax={1}
                    aria-valuetext={`${part.percent * 100} percent`}
                    role='progressbar'
                  />
                </Tooltip>
              ))}
          </div>
        </div>
      </div>
      {showLegend && (
        <div className={css.legendContainer}>
          {parts
            .filter((part) => part.percent !== 0 && !isNaN(part.percent))
            .map((part, idx) => (
              <li className={css.legendItem} key={idx}>
                <span className={css.colorButton} style={partStyle(part)}>
                  -
                </span>
                {part.label}
              </li>
            ))}
        </div>
      )}
    </>
  );
};

export default Progress;
