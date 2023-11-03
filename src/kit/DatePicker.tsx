import { DatePicker as AntdDatePicker } from 'antd';
import { Dayjs } from 'dayjs';
import type { PickerMode } from 'rc-picker/lib/interface';
import React from 'react';

import Label from 'kit/internal/Label';
import { useTheme } from 'kit/internal/Theme/theme';

import css from './DatePicker.module.scss';

interface DatePickerProps {
  allowClear?: boolean;
  disabledDate?: (currentDate: Dayjs) => boolean;
  label?: string;
  onChange?: (beforeDate: Dayjs | null) => void;
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
  picker?: PickerMode;
  showTime?: boolean;
  width?: number;
  value?: Dayjs | null;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, ...props }) => {
  const composedProps = {
    ...props,
    style: { minWidth: props.width },
    width: undefined,
  };
  const { themeSettings: { className: themeClass } } = useTheme();
  const classes = [css.base, themeClass];
  return (
    <div className={classes.join(' ')}>
      {label && <Label>{label}</Label>}
      <AntdDatePicker {...composedProps} />
    </div>
  );
};

export default DatePicker;
