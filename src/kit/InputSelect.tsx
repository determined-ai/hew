import { AutoComplete, AutoCompleteProps } from 'antd';
import React from 'react';

import { useTheme } from 'kit/Theme';

const InputSelect: React.FC<AutoCompleteProps> = (props: AutoCompleteProps) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  return <AutoComplete {...props} className={themeClass} />;
};

export default InputSelect;
