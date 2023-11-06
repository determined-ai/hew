import { Tooltip as AntdTooltip } from 'antd';
import React, { ReactNode } from 'react';

import { useTheme } from 'kit/internal/Theme/theme';
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

export interface TooltipProps {
  children?: ReactNode;
  content?: ReactNode;
  mouseEnterDelay?: number;
  open?: boolean;
  placement?: Placement;
  trigger?: 'hover' | 'focus' | 'click' | 'contextMenu' | Array<string>;
  showArrow?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  mouseEnterDelay,
  open,
  placement = 'top',
  ...props
}: TooltipProps) => {
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
      title={content}
      {...props}
    />
  );
};

export default Tooltip;
