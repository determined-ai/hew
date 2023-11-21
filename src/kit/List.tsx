import React, { ReactNode } from 'react';

import Button from 'kit/Button';
import Column from 'kit/Column';
import Dropdown from 'kit/Dropdown';
import Icon, { IconName } from 'kit/Icon';
import { AnyMouseEventHandler } from 'kit/internal/types';
import Row from 'kit/Row';
import { useTheme } from 'kit/Theme';

import css from './List.module.scss';

interface List {
  items: ListItem[];
}

interface Action {
  name: string;
  onClick: () => void;
}

export interface ListItem {
  icon?: IconName;
  title: string;
  subtitle?: ReactNode;
  buttons?: Action[];
  menu?: Action[];
  columns?: ReactNode[];
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
  const {
    themeSettings: { className: themeClass },
  } = useTheme();

  const classes = [css.base, themeClass];

  return (
    <div className={classes.join(' ')}>
      {items.map((row, idx) => {
        const rowClasses = [css.item];
        if (row.onClick) rowClasses.push(css.clickable);
        if (row.subtitle) rowClasses.push(css.subtitle);

        return (
          <div
            className={rowClasses.join(' ')}
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              row.onClick?.(e);
            }}>
            <Row>
              {row.icon && <span className={css.icon}><Icon decorative name={row.icon} size="small" /></span>}
              <Column gap={0}>
                <strong>{row.title}</strong>
                <span className={css.subtitle}>{row.subtitle}</span>
              </Column>
              {row.columns?.map((col, idx) => {
                return (
                  <React.Fragment key={idx}>
                    <Column>
                      {col}
                    </Column>
                  </React.Fragment>
                );
              })}
            </Row>
            {(row.buttons?.length || row.menu?.length) && (
              <div
                className={css.actions}
                onClick={(e) => {
                  e.stopPropagation();
                }}>
                <Row>
                  {row.buttons?.map((b, idx) => {
                    return <Button key={idx} onClick={b.onClick}>{b.name}</Button>;
                  })}
                  {row.menu?.length && (
                    <Dropdown
                      menu={getMenuOptions(row.menu)}
                      onClick={(key) => {
                        const opt = row.menu ? row.menu[parseInt(key)] : null;
                        opt?.onClick?.();
                      }}>
                      <Button icon={<Icon name="overflow-vertical" title="Action menu" />} type="text" />
                    </Dropdown>
                  )}
                </Row>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default List;
