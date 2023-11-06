import { Input as AntdInput, InputRef as AntdInputRef } from 'antd';
import React, {
  CSSProperties,
  FC,
  forwardRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  RefObject,
} from 'react';

import { useTheme } from 'kit/internal/Theme/theme';
import { useInputEscape } from 'kit/internal/useInputEscape';

import './Input.scss';
interface InputProps {
  addonAfter?: ReactNode;
  allowClear?: boolean | { clearIcon: ReactNode };
  autoComplete?: string;
  autoFocus?: boolean;
  bordered?: boolean;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  id?: string;
  max?: number;
  maxLength?: number;
  min?: number;
  onBlur?: <T extends HTMLInputElement | HTMLTextAreaElement>(
    e: React.FocusEvent<T> | React.KeyboardEvent<T>,
    previousValue?: string,
  ) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  prefix?: ReactNode;
  size?: 'large' | 'middle' | 'small';
  style?: CSSProperties;
  title?: string;
  type?: string;
  value?: string;
}

interface TextAreaProps {
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  value?: string;
}

interface PasswordProps {
  autoFocus?: boolean;
  disabled?: boolean;
  placeholder?: string;
  prefix?: ReactNode;
}

interface GroupProps {
  children?: ReactNode;
  className?: string;
  compact?: boolean;
}

const Input: Input = forwardRef<AntdInputRef, InputProps>((props: InputProps, ref) => {
  const { onFocus, onBlur, inputRef } = useInputEscape(ref, props.onBlur);
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  return (
    <AntdInput
      {...props}
      className={themeClass}
      ref={inputRef as RefObject<InputRef>}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
}) as Input;

type Input = ForwardRefExoticComponent<InputProps & RefAttributes<AntdInputRef>> & {
  Group: FC<GroupProps>;
  Password: ForwardRefExoticComponent<PasswordProps & RefAttributes<AntdInputRef>>;
  TextArea: ForwardRefExoticComponent<TextAreaProps & RefAttributes<AntdInputRef>>;
};

const Group = ({ ...props }: GroupProps): JSX.Element => {
  const {
    themeSettings: { className },
  } = useTheme();
  const classes = props?.className ? className.concat(' ', props.className) : className;
  return <Group {...props} className={classes} />;
};
Input.Group = Group;

Input.Password = forwardRef<AntdInputRef, PasswordProps>((props: PasswordProps, ref) => {
  const { onFocus, onBlur, inputRef } = useInputEscape(ref);
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  return (
    <AntdInput.Password
      {...props}
      className={themeClass}
      ref={inputRef as RefObject<InputRef>}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
});

Input.TextArea = forwardRef<AntdInputRef, TextAreaProps>((props: TextAreaProps, ref) => {
  const { onFocus, onBlur, inputRef } = useInputEscape(ref);
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  return (
    <AntdInput.TextArea
      {...props}
      className={themeClass}
      ref={inputRef}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
});

export type InputRef = AntdInputRef;

export default Input;
