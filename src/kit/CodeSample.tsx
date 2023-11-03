import React from 'react';

import ClipboardButton from './ClipboardButton';
import css from './CodeSample.module.scss';

interface Props {
  text: string;
}

const CodeSample: React.FC<Props> = ({ text }) => {
  return (
    <div className={css.base}>
      <div className={css.commandContainer}>
        <code className={css.codeSample}>{text}</code>
        <div>
          <ClipboardButton getContent={() => text} />
        </div>
      </div>
    </div>
  );
};

export default CodeSample;
