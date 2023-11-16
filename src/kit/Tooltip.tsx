import { Tooltip as AntdTooltip, TooltipProps } from 'antd';
import React, { ReactNode } from 'react';

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
  ...props
}: Props) => {
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
