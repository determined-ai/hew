import { Tabs, TabsProps } from 'antd';
import React, { KeyboardEvent, MouseEvent, ReactNode, useMemo } from 'react';

import { ElevationContext, useElevation } from 'kit/internal/Elevation';
import { useTheme } from 'kit/Theme';

import css from './Pivot.module.scss';

type TabItem = {
  children?: ReactNode;
  forceRender?: boolean;
  key: string;
  label: ReactNode;
  disabled?: boolean;
};

export type PivotTabType = 'primary' | 'secondary';

export interface PivotProps {
  activeKey?: string;
  defaultActiveKey?: string;
  destroyInactiveTabPane?: boolean;
  items?: TabItem[];
  onChange?: (activeKey: string) => void;
  onTabClick?: (key: string, event: MouseEvent | KeyboardEvent) => void;
  tabBarExtraContent?: ReactNode;
  type?: PivotTabType;
}

const convertTabType = (type: PivotTabType): TabsProps['type'] => {
  switch (type) {
    case 'primary':
      return 'line';
    case 'secondary':
      return 'card';
    default:
      return 'line';
  }
};

const Pivot: React.FC<PivotProps> = ({ type = 'primary', items, ...props }) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const tabType = convertTabType(type);
  const { elevationClass, nextElevation } = useElevation();
  const classes = [themeClass, css.base, elevationClass];

  const elevatedItems = useMemo(
    () =>
      items?.map((item) => ({
        ...item,
        children: (
          <ElevationContext.Provider value={nextElevation}>
            {item.children}
          </ElevationContext.Provider>
        ),
      })),
    [items, nextElevation],
  );
  return (
    <Tabs
      className={classes.join(' ')}
      items={elevatedItems}
      popupClassName={themeClass}
      type={tabType}
      {...props}
    />
  );
};

export default Pivot;
