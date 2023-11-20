import React, { ReactNode } from 'react';

import Button from 'kit/Button';
import Column from 'kit/Column';
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
  onClick: AnyMouseEventHandler;
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

        return (
          <div className={rowClasses.join(' ')} key={idx}>
            <Row height={row.subtitle ? 64 : 52}>
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
            <div className={css.button}><Button>Action</Button></div>
          </div>
        );
      })}
    </div>
  );
};

export default List;
