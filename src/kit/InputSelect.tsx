import { AutoComplete } from 'antd';
import React, { CSSProperties, useMemo, useState } from 'react';

import { useTheme } from 'kit/Theme';

interface Props {
  onChange?: (value: string) => void;
  options?: string[];
  width?: CSSProperties['width'];
  value?: string;
}

const InputSelect: React.FC<Props> = ({
  onChange,
  options,
  width = 200,
  value,
}: Props) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const [filterVal, setFilterVal] = useState('');

  const handleChange = (value: string) => {
    onChange?.(value);
  };

  const filteredOptions = useMemo(() => {
    if (!filterVal.length) return options;
    return options?.filter((option) => option.toLowerCase().includes(filterVal.toLowerCase()));
  }, [options, filterVal]);

  return (
    <AutoComplete
      className={themeClass}
      options={filteredOptions?.map((val) => ({ value: val }))}
      popupClassName={themeClass}
      style={{ width }}
      value={value}
      onChange={handleChange}
      onSearch={(text) => setFilterVal(text)}
    />
  );
};

export default InputSelect;
