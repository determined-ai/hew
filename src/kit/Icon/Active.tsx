import React from 'react';

import { useTheme } from 'kit/internal/Theme/theme';

import css from './Active.module.scss';

const Active: React.FC = () => {
  return (
    <div className={css.base}>
      <div className={css.dots} />
    </div>
  );
};

export default Active;
