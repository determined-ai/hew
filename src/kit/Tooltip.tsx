import { Tooltip as AntdTooltip, TooltipProps } from 'antd';
import React, { ReactNode, useCallback, useRef } from 'react';

import { useTheme } from 'kit/Theme';
export type Placement =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom';

export interface Props {
  children?: ReactNode;
  content?: ReactNode;
  mouseEnterDelay?: number;
  open?: boolean;
  placement?: Placement;
  trigger?: TooltipProps['trigger'];
  showArrow?: boolean;
}

const Tooltip: React.FC<Props> = ({
  content,
  mouseEnterDelay,
  open,
  placement = 'top',
  trigger,
  ...props
}: Props) => {
  const tootipContainer = useRef<HTMLElement>(null);
  const getTriggers = useCallback(() => {
    if (trigger === undefined || (trigger === 'hover' && tootipContainer.current?.focus)) {
      return [trigger || 'hover', 'focus'] as string[];
    }

    return trigger;
  }, [trigger]);
  const {
    themeSettings: { className },
  } = useTheme();

  return (
    <AntdTooltip
      autoAdjustOverflow
      className={className}
      mouseEnterDelay={mouseEnterDelay}
      open={open}
      overlayClassName={className}
      placement={placement}
      ref={tootipContainer}
      title={content}
      trigger={getTriggers()}
      {...props}
    />
  );
};

export default Tooltip;
