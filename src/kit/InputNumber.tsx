import { InputNumber as AntdInputNumber } from 'antd';
import React, { forwardRef } from 'react';

import { useTheme } from 'kit/Theme';
import { useInputNumberEscape } from 'kit/internal/useInputEscape';
interface InputNumberProps {
  className?: string;
  defaultValue?: number;
  disabled?: boolean;
  max?: number;
  min?: number;
  onChange?: (value: number | string | null) => void;
  placeholder?: string;
  precision?: number;
  step?: number;
  value?: number;
  onPressEnter?: (e: React.KeyboardEvent) => void;
}

const InputNumber: React.FC<InputNumberProps> = forwardRef(
  ({ ...props }: InputNumberProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const { onFocus, onBlur, inputRef } = useInputNumberEscape(ref);
    const {
      themeSettings: { className: themeClass },
    } = useTheme();
    return (
      <AntdInputNumber
        {...props}
        className={themeClass}
        ref={inputRef}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    );
  },
);

export default InputNumber;
