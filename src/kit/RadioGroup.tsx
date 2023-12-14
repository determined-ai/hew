import { Radio, RadioChangeEvent } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Button from 'kit/Button';
import Icon, { IconName, IconSize } from 'kit/Icon';
import useResize from 'kit/internal/useResize';
import { useTheme } from 'kit/Theme';
import Tooltip from 'kit/Tooltip';

import { ConditionalWrapper } from './internal/ConditionalWrapper';
import css from './RadioGroup.module.scss';

export const DEFAULT_RESIZE_THROTTLE_TIME = 500;

interface Props<T> {
  defaultValue?: T;
  iconOnly?: boolean;
  onChange?: (id: T) => void;
  options: RadioGroupOption<T>[];
  value?: T;
  radioType?: 'button' | 'radio' | 'row';
}

export interface RadioGroupOption<T> {
  icon?: IconName;
  iconSize?: IconSize;
  id: T;
  label: string;
}

interface SizeInfo {
  baseHeight: number;
  baseWidth: number;
  parentWidth: number;
}

const PARENT_WIDTH_BUFFER = 16;
const HEIGHT_LIMIT = 50;

function RadioGroup<T extends string | number>({
  defaultValue,
  iconOnly = false,
  onChange,
  options,
  value,
  radioType = 'button',
}: Props<T>): JSX.Element {
  const { refCallback, size, refObject: baseRef } = useResize();
  const originalWidth = useRef<number>();
  const [sizes, setSizes] = useState<SizeInfo>({ baseHeight: 0, baseWidth: 0, parentWidth: 0 });
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [css.base, themeClass];
  if (radioType === 'row') classes.push(css.row);

  const hasIconsAndLabels = useMemo(() => {
    if (options.length === 0) return false;
    return options.reduce((acc, option) => acc || (!!option.icon && !!option.label), false);
  }, [options]);

  const showLabels = useMemo(() => {
    if (radioType === 'row') return true;
    if (!hasIconsAndLabels || !baseRef.current) return true;
    if (sizes.baseWidth === 0 || sizes.parentWidth === 0) return true;
    if (originalWidth.current && originalWidth.current < sizes.parentWidth) return true;
    if (sizes.baseHeight > HEIGHT_LIMIT) return false;

    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasIconsAndLabels, sizes]);
  if (iconOnly) classes.push(css.iconOnly);

  const handleChange = useCallback(
    (e: RadioChangeEvent) => {
      onChange?.(e.target.value);
    },
    [onChange],
  );

  /*
   * Update parent and component sizes upon resize of the window,
   * at a throttled rate.
   */
  useEffect(() => {
    if (!hasIconsAndLabels || !baseRef.current) return;
    const parent = baseRef.current.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    if (!parentRect) return;

    const baseRect = size;
    if (!originalWidth.current) originalWidth.current = baseRect.width;

    setSizes({
      baseHeight: baseRect.height,
      baseWidth: parentRect.width,
      parentWidth: parentRect.width - PARENT_WIDTH_BUFFER,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasIconsAndLabels, size]);

  return (
    <Radio.Group
      className={classes.join(' ')}
      defaultValue={defaultValue}
      ref={refCallback}
      size={radioType === 'row' ? 'large' : undefined}
      value={value}
      onChange={handleChange}>
      {options.map((option) => (
        <ConditionalWrapper
          condition={!showLabels || iconOnly}
          key={option.id}
          wrapper={(children) => (
            <Tooltip content={option.label} placement="top">
              {children}
            </Tooltip>
          )}>
          {radioType === 'radio' ? (
            <Radio className={css.option} value={option.id}>
              {option.icon && <Icon decorative name={option.icon} size={option.iconSize} />}
              {option.label && showLabels && !iconOnly && (
                <span className={css.label}>{option.label}</span>
              )}
            </Radio>
          ) : radioType === 'row' ? (
            <Button
              column
              icon={<Icon decorative name={option.icon as IconName} size={option.iconSize} />}
              selected={value ? option.id === value : option.id === defaultValue}
              size="large"
              onClick={() => onChange?.(option.id)}>
              {option.label && showLabels && !iconOnly && (
                <span className={css.label}>{option.label}</span>
              )}
            </Button>
          ) : (
            <Radio.Button className={css.option} value={option.id}>
              {option.icon && <Icon decorative name={option.icon} size={option.iconSize} />}
              {option.label && showLabels && !iconOnly && (
                <span className={css.label}>{option.label}</span>
              )}
            </Radio.Button>
          )}
        </ConditionalWrapper>
      ))}
    </Radio.Group>
  );
}

export default RadioGroup;
