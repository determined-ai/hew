import { Typography } from 'antd';
import { EllipsisConfig } from 'antd/es/typography/Base';
import React from 'react';

import { ValueOf } from 'kit/utils/types';

import { useTheme } from './Theme';
import css from './Typography.module.scss';

export const TypographySize = {
  Default: 'default',
  L: 'large',
  S: 'small',
} as const;

export type TypographySize = ValueOf<typeof TypographySize>;

interface Props {
  size?: TypographySize;
  children: React.ReactNode;
  truncate?: EllipsisConfig;
}

const getClassName = (element: 'title' | 'body' | 'label' | 'code', size?: string) => {
  const classes: string[] = [css[element]];
  if (size) classes.push(css[size]);
  return classes.join(' ');
};

export const Title: React.FC<Props> = ({ children, truncate, size = 'default' }: Props) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [getClassName('title', size), themeClass];
  return (
    <Typography.Title className={classes.join(' ')} ellipsis={truncate ?? false}>
      {children}
    </Typography.Title>
  );
};

export const Body: React.FC<Props> = ({ children, truncate, size }: Props) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [getClassName('body', size), themeClass];
  return (
    <Typography.Paragraph className={classes.join(' ')} ellipsis={truncate ?? false}>
      {children}
    </Typography.Paragraph>
  );
};

export const Label: React.FC<Props> = ({ children, truncate, size }: Props) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [getClassName('label', size), themeClass];
  return (
    <Typography.Text className={classes.join(' ')} ellipsis={truncate ?? false}>
      {children}
    </Typography.Text>
  );
};

export const Code: React.FC<Props> = ({ children, truncate }: Omit<Props, 'size'>) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [getClassName('code'), themeClass];
  return (
    <Typography.Paragraph className={classes.join(' ')} ellipsis={truncate ?? false}>
      {children}
    </Typography.Paragraph>
  );
};
