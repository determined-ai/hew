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
}

const getClassName = (element: 'title' | 'body' | 'label' | 'code', size?: string) => {
  const classes: string[] = [css[element]];
  if (size) classes.push(css[size]);
  return classes.join(' ');
};

export const Title: React.FC<Props> = ({ children, size }: Props) => {
  return <h1 className={getClassName('title', size)}>{children}</h1>;
};

export const Body: React.FC<Props> = ({ children, size }: Props) => {
  return <p className={getClassName('body', size)}>{children}</p>;
};

export const Label: React.FC<Props> = ({ children, size }: Props) => {
  return <label className={getClassName('label', size)}>{children}</label>;
};

export const Code: React.FC<Props> = ({ children }: Omit<Props, 'size'>) => {
  return <p className={getClassName('code')}> {children}</p>;
};
