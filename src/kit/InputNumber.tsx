import { InputNumber as AntdInputNumber } from 'antd';
import React, { CSSProperties, forwardRef } from 'react';

import { ConditionalWrapper } from 'kit/internal/ConditionalWrapper';
import { useInputNumberEscape } from 'kit/internal/useInputEscape';
import Row from 'kit/Row';
import { useTheme } from 'kit/Theme';

interface InputNumberProps {
  controls?: boolean;
  defaultValue?: number;
  disabled?: boolean;
  id?: string;
  label?: string;
  max?: number;
  min?: number;
  onChange?: (value: number | string | null) => void;
  placeholder?: string;
  precision?: number;
  step?: number;
  value?: number;
  width?: CSSProperties['width'];
  onPressEnter?: (e: React.KeyboardEvent) => void;
}

const InputNumber: React.FC<InputNumberProps> = forwardRef(
  ({ width, ...props }: InputNumberProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const { onFocus, onBlur, inputRef } = useInputNumberEscape(ref);
    const {
      themeSettings: { className: themeClass },
    } = useTheme();
    return (
      <ConditionalWrapper
        condition={!!props.label}
        wrapper={(children) => (
          <Row>
            <label htmlFor={props.id}>{props.label}</label>
            {children}
          </Row>
        )}>
        <AntdInputNumber
          {...props}
          className={themeClass}
          ref={inputRef}
          style={{ width }}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </ConditionalWrapper>
    );
  },
);

export default InputNumber;
