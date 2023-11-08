import React from 'react';

import { useTheme } from 'kit/Theme';

import css from './Section.module.scss';

interface Props {
  children: React.ReactNode;
  titleDivider?: boolean;
  title?: string | React.ReactNode;
}

const Section: React.FC<Props> = ({ children, titleDivider = false, title }) => {
  const {
    themeSettings: { className },
  } = useTheme();
  const classes = [className, css.base];
  const titleClasses = [css.title];

  if (titleDivider && title) classes.push(css.titleDivider);
  if (typeof title === 'string') titleClasses.push(css.string);

  return (
    <section className={classes.join(' ')}>
      {!!title && (
        <div className={css.header}>
          <h5 className={titleClasses.join(' ')}>{title}</h5>
        </div>
      )}
      <div className={css.body}>{children}</div>
    </section>
  );
};

export default Section;
