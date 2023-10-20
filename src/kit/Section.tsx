import React from 'react';

import { generateAlphaNumeric, isString, toHtmlId } from './internal/functions';
import css from './Section.module.scss';

interface Props {
  children: React.ReactNode;
  divider?: boolean;
  title?: string | React.ReactNode;
}

const defaultProps = { divider: false };

const Section: React.FC<Props> = (props: Props) => {
  const id = isString(props.title) ? toHtmlId(props.title) : generateAlphaNumeric();
  const classes = [css.base];
  const titleClasses = [css.title];

  if (props.divider) classes.push(css.divider);
  if (typeof props.title === 'string') titleClasses.push(css.string);

  return (
    <section className={classes.join(' ')} id={id}>
      {!!props.title && (
        <div className={css.header}>
          <h5 className={titleClasses.join(' ')}>{props.title}</h5>
        </div>
      )}
      <div className={css.body}>{props.children}</div>
    </section>
  );
};

Section.defaultProps = defaultProps;

export default Section;
