import React, { CSSProperties } from 'react';

import Collection, { LayoutMode } from 'kit/Collection';
import Icon from 'kit/Icon';
import { isNumber } from 'kit/internal/functions';
import { useTheme } from 'kit/Theme';

import Button from './Button';
import css from './Card.module.scss';
import Dropdown, { MenuItem } from './Dropdown';
import { AnyMouseEventHandler } from './internal/types';
import Surface from './Surface';
import { ShirtSize } from './Theme';

type CardProps = {
  actionMenu?: MenuItem[];
  children?: React.ReactNode;
  disabled?: boolean;
  size?: CardSize;
  onDropdown?: (key: string) => void;
  onClick?: AnyMouseEventHandler;
  testId?: string;
};

export type CardSize = 'small' | 'medium';

const CardSizes: Record<CardSize, Required<Pick<CSSProperties, 'minHeight' | 'minWidth'>>> = {
  medium: { minHeight: '110px', minWidth: '302px' },
  small: { minHeight: '64px', minWidth: '143px' },
} as const;

type Card = React.FC<CardProps> & {
  Group: React.FC<CardGroupProps>;
};

const stopPropagation = (e: React.MouseEvent): void => e.stopPropagation();

const Card: Card = ({
  actionMenu,
  children,
  disabled = false,
  onClick,
  onDropdown,
  size = 'small',
  testId
}: CardProps) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classnames = [css.cardBase, themeClass];
  if (onClick) classnames.push(css.clickable);
  const sizeStyle = CardSizes[size];
  switch (size) {
    case 'small':
      classnames.push(css.smallCard);
      break;
    case 'medium':
      classnames.push(css.mediumCard);
      break;
  }

  const actionsAvailable = actionMenu?.length !== undefined && actionMenu.length > 0;

  return (
    <div
      className={classnames.join(' ')}
      style={sizeStyle}
      tabIndex={onClick ? 0 : -1}
      data-testid={testId}
      onClick={onClick}>
      <Surface hover={!!onClick}>
        <section className={css.content}>{children}</section>
        {actionsAvailable && (
          <div className={css.action} onClick={stopPropagation}>
            <Dropdown
              disabled={disabled}
              menu={actionMenu}
              placement="bottomRight"
              onClick={onDropdown}>
              <Button
                icon={<Icon name="overflow-horizontal" size="tiny" title="Action menu" />}
                type="text"
                onClick={stopPropagation}
              />
            </Dropdown>
          </div>
        )}
      </Surface>
    </div>
  );
};

interface CardGroupProps {
  children?: React.ReactNode;
  size?: CardSize; // This should match the size of cards in group.
  wrap?: boolean;
}

const CardGroup: React.FC<CardGroupProps> = ({
  children,
  wrap = true,
  size = 'small',
}: CardGroupProps) => {
  const cardSize = CardSizes[size].minWidth;
  const minCardWidth = isNumber(cardSize) ? cardSize : parseInt(cardSize);
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [css.groupBase, themeClass];
  return (
    <div className={classes.join(' ')}>
      <Collection
        gap={ShirtSize.Large}
        minItemWidth={minCardWidth}
        mode={wrap ? LayoutMode.AutoFill : LayoutMode.ScrollableRow}>
        {children}
      </Collection>
    </div>
  );
};

Card.Group = CardGroup;

export default Card;
