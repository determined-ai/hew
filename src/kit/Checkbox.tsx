import { Checkbox as AntdCheckbox } from 'antd';
import type { CheckboxChangeEvent as AntdCheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { ReactNode } from 'react';

import { useTheme } from 'kit/Theme';

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
  return <AntdCheckbox className={themeClass} {...props} />;
};

type Checkbox = React.FC<CheckboxProps> & {
  Group: React.FC<GroupProps>;
};

Checkbox.Group = AntdCheckbox.Group;

export default Checkbox;
