import React from 'react';

import { useTheme } from 'kit/Theme';
import { Body, Label } from 'kit/Typography';

import css from './Glossary.module.scss';
import { ensureArray, isString } from './internal/functions';
export interface InfoRow {
  value: string | React.ReactElement | (string | React.ReactElement)[];
  label: string;
}

interface Props {
  content?: InfoRow[];
  alignValues?: 'left' | 'right';
}

export const Row: React.FC<InfoRow> = ({ label, value }: InfoRow) => {
  const valueArray = ensureArray(value);
  return (
    <div className={css.row}>
      <dt className={css.label}>
        <Label size="default">{label}</Label>
      </dt>
      <div className={css.valueList}>
        {valueArray.map((item, idx) => (
          <dd className={css.value} key={idx}>
            {isString(item) ? item : <div className={css.componentWrapper}>{item}</div>}
          </dd>
        ))}
      </div>
    </div>
  );
};

const Glossary: React.FC<Props> = ({ content = [], alignValues = 'left' }: Props) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [css.base, themeClass, css[`align-${alignValues}`]];
  return (
    <dl className={classes.join(' ')}>
      {content.map((row, idx) => (
        <Row key={row.label + idx} label={row.label} value={row.value} />
      ))}
    </dl>
  );
};

export default Glossary;
