import React, { ReactNode } from 'react';

import Button from 'kit/Button';
import Column from 'kit/Column';
import Dropdown from 'kit/Dropdown';
import Icon, { IconName } from 'kit/Icon';
import { ElevationWrapper } from 'kit/internal/Elevation';
import { AnyMouseEventHandler } from 'kit/internal/types';
import Row from 'kit/Row';

import css from './List.module.scss';

interface List {
  items: ListItem[];
}

interface Action {
  name: string;
  onClick: () => void;
}

interface ListColumn {
  width?: number;
  content: ReactNode;
}

export interface ListItem {
  icon?: IconName;
  title: string;
  subtitle?: ReactNode;
  buttons?: Action[];
  menu?: Action[];
  columns?: ListColumn[];
  onClick?: AnyMouseEventHandler;
}

const getMenuOptions = (menu?: Action[]) => {
  return menu?.map((m, idx) => {
    return {
      key: idx,
      label: m.name,
    };
  });
};

const List: React.FC<List> = ({ items }: List) => {
  return (
    <div>
      {items.map((row, idx) => {
        const rowClasses = [css.item];
        if (row.onClick) rowClasses.push(css.clickable);

        return (
          <ElevationWrapper className={rowClasses.join(' ')} key={idx} onClick={row.onClick}>
            <Row align="center" horizontalPadding={16}>
              {row.icon && (
                <span className={css.icon}>
                  <Icon decorative name={row.icon} size="small" />
                </span>
              )}
              <Row align="center" justifyContent="space-between" width="fill">
                <Column gap={0} width="hug">
                  <strong>{row.title}</strong>
                  {row.subtitle && <span className={css.subtitle}>{row.subtitle}</span>}
                </Column>
                {row.columns?.map((col, idx) => {
                  return (
                    <Column key={idx} width={col.width ? col.width : 'hug'}>
                      {col.content}
                    </Column>
                  );
                })}
              </Row>
            </Row>
            {((row.buttons && row.buttons.length > 0) || (row.menu && row.menu.length > 0)) && (
              <div
                className={css.actions}
                onClick={(e) => {
                  e.stopPropagation();
                }}>
                <Row>
                  {row.buttons?.map((b, idx) => {
                    return (
                      <Button key={idx} onClick={b.onClick}>
                        {b.name}
                      </Button>
                    );
                  })}
                  {row.menu && row.menu.length > 0 && (
                    <Dropdown
                      menu={getMenuOptions(row.menu)}
                      onClick={(key) => {
                        const opt = row.menu ? row.menu[parseInt(key)] : undefined;
                        opt?.onClick?.();
                      }}>
                      <Button icon={<Icon name="overflow-vertical" title="Action menu" />} />
                    </Dropdown>
                  )}
                </Row>
              </div>
            )}
          </ElevationWrapper>
        );
      })}
    </div>
  );
};

export default List;
