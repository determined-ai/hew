import React from 'react';

import css from './Glossary.module.scss';
import { ensureArray } from './internal/functions';

export interface InfoRow {
  value: string | React.ReactElement | (string | React.ReactElement)[];
  label: string;
}

interface Props {
  content?: InfoRow[];
}

export const Row: React.FC<InfoRow> = ({ label, value }: InfoRow) => {
  const valueArray = ensureArray(value);
  return (
    <div className={css.row}>
      <dt className={css.label}>{label}</dt>
      <div className={css.valueList}>
        {valueArray.map((item, idx) => (
          <dd className={css.value} key={idx}>
            {item}
          </dd>
        ))}
      </div>
    </div>
  );
};

const Glossary: React.FC<Props> = ({ content = [] }: Props) => {
  return (
    <dl className={css.base}>
      {content.map((row, idx) => (
        <Row key={row.label + idx} label={row.label} value={row.value} />
      ))}
    </dl>
  );
};

export default Glossary;
