import React from 'react';

import type { TooltipProps } from 'kit/Tooltip';
const { default: OriginalTooltip } = await vi.importActual<typeof import('kit/Tooltip')>(
  'kit/Tooltip',
);

const Tooltip: React.FC<TooltipProps> = (props: TooltipProps) => {
  return <OriginalTooltip {...props} mouseEnterDelay={0} />;
};
export default Tooltip;
