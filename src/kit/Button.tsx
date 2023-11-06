import { Button as AntdButton } from 'antd';
import React, { forwardRef, MouseEvent, ReactNode } from 'react';

import Icon from 'kit/Icon';
import { ConditionalWrapper } from 'kit/internal/ConditionalWrapper';
import { useTheme } from 'kit/internal/Theme/theme';
import Tooltip from 'kit/Tooltip';

import css from './Button.module.scss';

interface ButtonProps {
  block?: boolean;
  children?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  form?: string;
  hideChildren?: boolean;
  htmlType?: 'button' | 'submit' | 'reset';
  icon?: ReactNode;
  column?: boolean;
  loading?: boolean | { delay?: number };
  onClick?: (event: MouseEvent) => void;
  ref?: React.Ref<HTMLElement>;
  selected?: boolean;
  size?: 'large' | 'middle' | 'small';
  type?: 'primary' | 'text' | 'default' | 'dashed';
  tooltip?: string;
}

interface CloneElementProps {
  // antd parent component (Dropdown) may set this component's className prop via cloneElement.
  className?: string;
}

const Button: React.FC<ButtonProps> = forwardRef(
  (
    {
      size = 'middle',
      tooltip = '',
      className, // do not include className in {...props} below.
      hideChildren = false,
      children,
      icon,
      loading,
      ...props
    }: ButtonProps & CloneElementProps,
    ref,
  ) => {
    const {
      themeSettings: { className: themeClass },
    } = useTheme();
    const classes = [css.base, themeClass];
    if (className) classes.push(className); // preserve className value set via cloneElement.
    if (props.selected) classes.push(css.selected);
    if (props.column) classes.push(css.column);

    if (loading) {
      icon = <Icon decorative name="spinner" />;
      children = 'Loading';
    }

    return (
      <ConditionalWrapper
        condition={tooltip.length > 0}
        wrapper={(children) => <Tooltip content={tooltip}>{children}</Tooltip>}>
        <AntdButton
          className={classes.join(' ')}
          ref={ref}
          size={size}
          tabIndex={props.disabled ? -1 : 0}
          {...props}>
          <div className={css.content}>
            {icon && <div className={css.icon}>{icon}</div>}
            {!hideChildren && children && <div className={css.children}>{children}</div>}
          </div>
        </AntdButton>
      </ConditionalWrapper>
    );
  },
);

export default Button;
