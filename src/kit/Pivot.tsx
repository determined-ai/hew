import { Tabs, TabsProps } from 'antd';
import React, { KeyboardEvent, MouseEvent, ReactNode, useContext, useMemo } from 'react';

import { ElevationContext } from 'kit/internal/Elevation';
import { ElevationLevels, useTheme } from 'kit/Theme';

import css from './Pivot.module.scss';

type TabItem = {
  children?: ReactNode;
  forceRender?: boolean;
  key: string;
  label: ReactNode;
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
  const currentElevation = useContext(ElevationContext);
  const elevationClasses = [css.e0, css.e1, css.e2, css.e3, css.e4];
  const tabType = convertTabType(type);
  const classes = [themeClass, css.base, elevationClasses[currentElevation]];

  const elevatedItems = useMemo(
    () =>
      items?.map((item) => ({
        ...item,
        children: (
          <ElevationContext.Provider value={Math.min(currentElevation + 1, 4) as ElevationLevels}>
            {item.children}
          </ElevationContext.Provider>
        ),
      })),
    [currentElevation, items],
  );
  return <Tabs className={classes.join(' ')} items={elevatedItems} type={tabType} {...props} />;
};

export default Pivot;
