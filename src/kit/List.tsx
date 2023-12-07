import React, { ReactNode } from 'react';

import Button from 'kit/Button';
import Column from 'kit/Column';
import Dropdown from 'kit/Dropdown';
import Icon, { IconName } from 'kit/Icon';
import { ElevationWrapper } from 'kit/internal/Elevation';
import { AnyMouseEventHandler } from 'kit/internal/types';
import Row from 'kit/Row';
import { Label, Title } from 'kit/Typography';

import css from './List.module.scss';

interface List {
  items: ListItem[];
  compact?: boolean;
}

interface Action {
  name: string;
  onClick: () => void;
}

export interface ListItem {
  icon: IconName;
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

const List: React.FC<List> = ({ items, compact }: List) => {
  return (
    <div>
      {items.map((row, idx) => {
        const rowClasses = [css.item];
        if (row.onClick) rowClasses.push(css.clickable);
        if (compact) rowClasses.push(css.compact);

        return (
          <ElevationWrapper
            border
            className={rowClasses.join(' ')}
            hover
            key={idx}
            tabIndex={0}
            onClick={row.onClick}>
            <Row height={row.subtitle ? 52 : 40}>
              <Column width="hug">
                <span className={css.icon}>
                  <Icon decorative name={row.icon} size="small" />
                </span>
              </Column>
              <Row width="fill">
                <Column gap={0} width="fill">
                  <Title size="x-small">{row.title}</Title>
                  {!compact && row.subtitle && (
                    <Label inactive size="small">
                      {row.subtitle}
                    </Label>
                  )}
                </Column>
                {!compact &&
                  row.columns?.map((col, idx) => {
                    return (
                      <Column key={idx} width="fill">
                        {col}
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
                      <Button
                        icon={<Icon name="overflow-vertical" title="Action menu" />}
                        type="text"
                      />
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
