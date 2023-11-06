import { Tabs } from 'antd';
import { TabsType } from 'antd/es/tabs';
import React, { KeyboardEvent, MouseEvent, ReactNode } from 'react';

import { useTheme } from 'kit/Theme';

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

const convertTabType = (type: PivotTabType): TabsType => {
  switch (type) {
    case 'primary':
      return 'line';
    case 'secondary':
      return 'card';
    default:
      return 'line';
  }
};

const Pivot: React.FC<PivotProps> = ({ type = 'primary', ...props }) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const tabType = convertTabType(type);
  const classes = [themeClass, css.base];
  return <Tabs className={classes.join(' ')} type={tabType} {...props} />;
};

export default Pivot;
