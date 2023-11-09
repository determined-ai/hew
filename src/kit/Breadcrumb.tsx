import { Breadcrumb as AntdBreadcrumb } from 'antd';
import React, { ReactNode } from 'react';

import Button from 'kit/Button';
import Column from 'kit/Column';
import Dropdown, { MenuItem } from 'kit/Dropdown';
import Icon from 'kit/Icon';
import Row from 'kit/Row';
import { useTheme } from 'kit/Theme';

import css from './Breadcrumb.module.css';

interface BreadcrumbProps {
  children?: ReactNode;
  separator?: ReactNode;
  menuItems?: MenuItem[];
  onClickMenu?: (key: string) => void;
}

interface BreadcrumbItemProps {
  children?: ReactNode;
}

type BreadcrumbItem = React.FC<BreadcrumbItemProps>;
type BreadcrumbSeparator = React.FC;
type Breadcrumb = React.FC<BreadcrumbProps> & {
  Item: BreadcrumbItem;
  Separator: BreadcrumbSeparator;
};

const Breadcrumb: Breadcrumb = (props: BreadcrumbProps) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [css.base, themeClass];
  return (
    <div className={classes.join(' ')}>
      <Row>
        <Column>
          <AntdBreadcrumb separator={props.separator}>{props.children}</AntdBreadcrumb>
        </Column>
        {props.menuItems && (
          <Column align="left">
            <Dropdown menu={props.menuItems} onClick={props.onClickMenu}>
              <Button
                icon={<Icon name="arrow-down" size="tiny" title="Action menu" />}
                size="small"
                type="text"
              />
            </Dropdown>
          </Column>
        )}
      </Row>
    </div>
  );
};

Breadcrumb.Item = AntdBreadcrumb.Item;
Breadcrumb.Separator = AntdBreadcrumb.Separator;
export default Breadcrumb;
