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

const getEllipsisConfig = (themeClass: string, children: ReactNode, truncate?: TruncateProps) => {
  let ellipsis: EllipsisConfig | undefined;
  if (truncate) {
    ellipsis = {
      rows: truncate.rows,
      tooltip: truncate.tooltip
        ? {
            overlayClassName: themeClass,
            title: !isBoolean(truncate.tooltip) ? truncate.tooltip : children,
          }
        : false,
    };
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
    <Typography.Title className={classes.join(' ')} ellipsis={ellipsis}>
      {children}
    </Typography.Title>
  );
};

export const Body: React.FC<TypographyProps> = ({
  children,
  truncate,
  size = 'default',
}: TypographyProps) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [getClassName('body', size), themeClass];
  const ellipsis = getEllipsisConfig(themeClass, children, truncate);
  return (
    <Typography.Paragraph className={classes.join(' ')} ellipsis={ellipsis}>
      {children}
    </Typography.Paragraph>
  );
};

type LabelProps = TypographyProps & { inactive?: boolean };
export const Label: React.FC<LabelProps> = ({
  children,
  truncate,
  inactive,
  size = 'default',
}: LabelProps) => {
  const {
    getThemeVar,
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [getClassName('label', size), themeClass];
  const ellipsis = getEllipsisConfig(themeClass, children, truncate);
  return (
    <Typography.Text
      className={classes.join(' ')}
      ellipsis={ellipsis}
      style={{
        color: inactive ? getThemeVar('statusInactive') : undefined,
      }}>
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
    <Typography.Paragraph className={classes.join(' ')} ellipsis={ellipsis}>
      {children}
    </Typography.Paragraph>
  );
};
