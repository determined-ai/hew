import { Checkbox as AntdCheckbox } from 'antd';
import type { CheckboxChangeEvent as AntdCheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { ReactNode } from 'react';

import { useTheme } from 'kit/Theme';

import css from './Checkbox.module.scss';

export type CheckboxChangeEvent = AntdCheckboxChangeEvent;

interface CheckboxProps {
  checked?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  id?: string;
  indeterminate?: boolean;
  onChange?: (event: CheckboxChangeEvent) => void;
}

interface GroupProps {
  children?: ReactNode;
}

const Checkbox: Checkbox = (props: CheckboxProps) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [css.base, themeClass];

  return <AntdCheckbox className={classes.join(' ')} {...props} />;
};

type Checkbox = React.FC<CheckboxProps> & {
  Group: React.FC<GroupProps>;
};

Checkbox.Group = AntdCheckbox.Group;

export default Checkbox;
