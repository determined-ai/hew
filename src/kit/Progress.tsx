import React from 'react';

import { floatToPercent } from 'kit/internal/string';
import { ShirtSize } from 'kit/Theme';
import Tooltip from 'kit/Tooltip';

import css from './Progress.module.scss';

export interface BarPart {
  bordered?: string;
  color: string; // css color
  label?: string;
  percent: number; // between 0-1
}

export interface Props {
  inline?: boolean;
  parts: BarPart[];
  showLegend?: boolean;
  size?: ShirtSize;
  title?: string;
}

const partStyle = (part: BarPart) => ({
  backgroundColor: part.color,
  width: floatToPercent(part.percent, 0),
});

const sizeMap = {
  [ShirtSize.Small]: '4px',
  [ShirtSize.Medium]: '12px',
  [ShirtSize.Large]: '24px',
};

const Progress: React.FC<Props> = ({
  inline,
  parts,
  showLegend,
  size = ShirtSize.Small,
  title,
}: Props) => {
  const classes: string[] = [css.base];

  if (inline) classes.push(css.inline);

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
                <Tooltip content={!showLegend && part.label} key={idx}>
                  <li
                    style={{
                      ...partStyle(part),
                      cursor: !showLegend && part.label ? 'pointer' : '',
                    }}
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
