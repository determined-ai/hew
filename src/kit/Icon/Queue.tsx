import React, { CSSProperties, useMemo } from 'react';

import { useTheme } from 'kit/internal/Theme/theme';

import css from './Queue.module.scss';

export interface Props {
  backgroundColor?: CSSProperties['backgroundColor'];
  opacity?: CSSProperties['opacity'];
}

const Queue: React.FC<Props> = ({ backgroundColor, opacity }) => {
  const spinnerStyle = useMemo(() => {
    return { backgroundColor, opacity };
  }, [backgroundColor, opacity]);

  return (
    <div className={css.base}>
      <div className={css.spinner} style={spinnerStyle} />
      <div className={css.innerSpinner} style={spinnerStyle} />
    </div>
  );
};

export default Queue;
