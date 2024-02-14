import { Input } from 'antd';
import React from 'react';

import { useTheme } from 'kit/Theme';

import css from './Inputs.module.scss';

interface InputSearchProps {
  allowClear?: boolean;
  disabled?: boolean;
  enterButton?: boolean;
  placeholder?: string;
  value?: string;
}

const InputSearch: React.FC<InputSearchProps> = (props: InputSearchProps) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  return <Input.Search {...props} className={[themeClass, css.hasAffix].join(' ')} />;
};

export default InputSearch;
