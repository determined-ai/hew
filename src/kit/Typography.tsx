import { Typography } from 'antd';
import { EllipsisConfig } from 'antd/es/typography/Base';
import { isBoolean } from 'lodash';
import React, { ReactNode } from 'react';

import { ValueOf } from 'kit/utils/types';

import { useTheme } from './Theme';
import css from './Typography.module.scss';

export const TypographySize = {
  Default: 'default',
  L: 'large',
  S: 'small',
  XS: 'x-small',
} as const;

export type TypographySize = ValueOf<typeof TypographySize>;

interface TypographyProps {
  size?: TypographySize;
  children: ReactNode;
  truncate?: TruncateProps;
}

interface TruncateProps {
  rows?: number;
  tooltip?: boolean | ReactNode;
}

const getEllipsisConfig = (
  themeClass: string,
  children: ReactNode,
  truncate?: TruncateProps,
  isText: boolean = false,
) => {
  let ellipsis: EllipsisConfig | undefined;
  if (truncate) {
    ellipsis = {
      tooltip: truncate.tooltip
        ? {
            overlayClassName: themeClass,
            title: !isBoolean(truncate.tooltip) ? truncate.tooltip : children,
            trigger: ['hover', 'focus'],
          }
        : false,
    };

    if (!isText) ellipsis.rows = truncate.rows;
  }
  return ellipsis;
};

const getClassName = (element: 'title' | 'body' | 'label' | 'code', size?: string) => {
  const classes: string[] = [css[element]];
  if (size) classes.push(css[size]);
  return classes.join(' ');
};

export const Title: React.FC<TypographyProps> = ({
  children,
  truncate,
  size = 'default',
}: TypographyProps) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [getClassName('title', size), themeClass];
  const ellipsis = getEllipsisConfig(themeClass, children, truncate);

  return (
    <Typography.Title
      className={classes.join(' ')}
      ellipsis={ellipsis}
      tabIndex={truncate?.tooltip ? 0 : undefined}>
      {children}
    </Typography.Title>
  );
};

type BodyProps = TypographyProps & { inactive?: boolean };
export const Body: React.FC<BodyProps> = ({
  children,
  truncate,
  inactive,
  size = 'default',
}: BodyProps) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [getClassName('body', size), themeClass];
  const ellipsis = getEllipsisConfig(themeClass, children, truncate);
  if (inactive) classes.push(css.inactive);

  return (
    <Typography.Paragraph
      className={classes.join(' ')}
      ellipsis={ellipsis}
      tabIndex={truncate?.tooltip ? 0 : undefined}>
      {children}
    </Typography.Paragraph>
  );
};

type LabelProps = TypographyProps & {
  inactive?: boolean;
  strong?: boolean;
};
export const Label: React.FC<LabelProps> = ({
  children,
  truncate,
  inactive,
  strong,
  size = 'default',
}: LabelProps) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [getClassName('label', size), themeClass];
  const ellipsis = getEllipsisConfig(themeClass, children, truncate, true);
  if (strong) classes.push(css.strong);
  if (inactive) classes.push(css.inactive);

  return (
    <Typography.Text
      className={classes.join(' ')}
      ellipsis={ellipsis}
      tabIndex={truncate?.tooltip ? 0 : undefined}>
      {children}
    </Typography.Text>
  );
};

type CodeProps = Omit<TypographyProps, 'size'>;
export const Code: React.FC<CodeProps> = ({ children, truncate }: CodeProps) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [getClassName('code'), themeClass];
  const ellipsis = getEllipsisConfig(themeClass, children, truncate);
  return (
    <Typography.Paragraph
      className={classes.join(' ')}
      ellipsis={ellipsis}
      tabIndex={truncate?.tooltip ? 0 : undefined}>
      {children}
    </Typography.Paragraph>
  );
};
