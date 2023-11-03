import { Input } from 'antd';
import React from 'react';

import { useTheme } from 'kit/internal/Theme/theme';

interface InputSearchProps {
  allowClear?: boolean;
  disabled?: boolean;
  enterButton?: boolean;
  placeholder?: string;
  value?: string;
}

const InputSearch: React.FC<InputSearchProps> = (props: InputSearchProps) => {
  const { themeSettings: { className: themeClass } } = useTheme();
  return <Input.Search {...props} className={themeClass} />;
};

export default InputSearch;
