import { Typography } from 'antd';
import { EllipsisConfig } from 'antd/es/typography/Base';
import React from 'react';

import { ValueOf } from 'kit/utils/types';

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
  return (
    <Typography.Title className={getClassName('title', size)} ellipsis={truncate}>
      {children}
    </Typography.Title>
  );
};

export const Body: React.FC<Props> = ({ children, truncate, size }: Props) => {
  return (
    <Typography.Paragraph className={getClassName('body', size)} ellipsis={truncate}>
      {children}
    </Typography.Paragraph>
  );
};

export const Label: React.FC<Props> = ({ children, truncate, size }: Props) => {
  return (
    <Typography.Text className={getClassName('label', size)} ellipsis={truncate}>
      {children}
    </Typography.Text>
  );
};

export const Code: React.FC<Props> = ({ children, truncate }: Omit<Props, 'size'>) => {
  return (
    <Typography.Paragraph className={getClassName('code')} ellipsis={truncate}>
      {' '}
      {children}
    </Typography.Paragraph>
  );
};
