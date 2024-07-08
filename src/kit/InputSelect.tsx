import { AutoComplete } from 'antd';
import React, { CSSProperties, useMemo, useState } from 'react';

import { useTheme } from 'kit/Theme';

interface Props {
  allowClear?: boolean;
  autoFocus?: boolean;
  customFilter?: (options: string[], filterValue: string) => string[];
  defaultValue?: string;
  disabled?: boolean;
  options: string[];
  placeholder?: string;
  value?: string;
  width?: CSSProperties['width'];
  onBlur?: () => void;
  onFocus?: () => void;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onDropdownVisibleChange?: (open: boolean) => void;
}

const InputSelect: React.FC<Props> = ({
  allowClear,
  autoFocus,
  customFilter,
  defaultValue,
  disabled,
  options,
  placeholder,
  value,
  width = 200,
  onBlur,
  onFocus,
  onChange,
  onKeyDown,
  onDropdownVisibleChange,
}: Props) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const [filterValue, setFilterValue] = useState('');

  const filteredOptions = useMemo(() => {
    if (customFilter) return customFilter(options, filterValue);
    return options?.filter((option) => option.toLowerCase().includes(filterValue.toLowerCase()));
  }, [options, filterValue, customFilter]);

  return (
    <AutoComplete
      allowClear={allowClear}
      autoFocus={autoFocus}
      className={themeClass}
      defaultValue={defaultValue}
      disabled={disabled}
      options={filteredOptions?.map((val) => ({ value: val }))}
      placeholder={placeholder}
      popupClassName={themeClass}
      style={{ width }}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      onDropdownVisibleChange={onDropdownVisibleChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onSearch={(text) => setFilterValue(text)}
    />
  );
};

export default InputSelect;
