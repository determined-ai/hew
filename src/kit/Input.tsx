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

import { useInputEscape } from 'kit/internal/useInputEscape';
import { useTheme } from 'kit/Theme';

import './Input.scss';
import css from './Inputs.module.scss';

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
  width?: CSSProperties['width'];
  placeholder?: string;
  prefix?: ReactNode;
  size?: 'large' | 'middle' | 'small';
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

const Input: Input = forwardRef<AntdInputRef, InputProps>(
  ({ width, ...props }: InputProps, ref) => {
    const { onFocus, onBlur, inputRef } = useInputEscape(ref, props.onBlur);
    const {
      themeSettings: { className },
    } = useTheme();
    const classes = props?.className ? className.concat(' ', props.className) : className;
    return (
      <AntdInput
        {...props}
        className={classes}
        ref={inputRef as RefObject<InputRef>}
        style={{ width }}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    );
  },
) as Input;

type Input = ForwardRefExoticComponent<InputProps & RefAttributes<AntdInputRef>> & {
  Group: FC<GroupProps>;
  Password: ForwardRefExoticComponent<PasswordProps & RefAttributes<AntdInputRef>>;
  TextArea: ForwardRefExoticComponent<TextAreaProps & RefAttributes<AntdInputRef>>;
};

const Group: FC<GroupProps> = (props: GroupProps) => {
  const {
    themeSettings: { className },
  } = useTheme();
  const classes = props?.className ? className.concat(' ', props.className) : className;
  return <AntdInput.Group {...props} className={classes} />;
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
      className={[themeClass, css.hasAffix].join(' ')}
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
