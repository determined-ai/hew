import { Popover as AntdPopover, Dropdown as AntDropdown } from 'antd';
import { MenuProps as AntdMenuProps } from 'antd/es/menu/menu';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import React, { useCallback, useMemo } from 'react';

import { useTheme } from 'kit/Theme';

import css from './Dropdown.module.scss';
import { XOR } from './utils/types';

export interface MenuDivider {
  type: 'divider';
}

export interface MenuOption {
  danger?: boolean;
  disabled?: boolean;
  key: number | string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: MenuClickEventHandler;
  tabIndex?: number;
  type?: 'option';
}

export interface MenuOptionGroup {
  children: MenuItem[];
  label: React.ReactNode;
  type: 'group';
}

export type MenuItem = MenuDivider | MenuOption | MenuOptionGroup | null;

export type Placement = 'bottomLeft' | 'bottomRight';

export type DropdownEvent = React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;

interface BaseProps {
  children?: React.ReactNode;
  disabled?: boolean;
  isContextMenu?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  autoWidthOverlay?: boolean;
  placement?: Placement;
  onClick?: (key: string, e: DropdownEvent) => void | Promise<void>;
}

type ContentProps = {
  content: React.ReactNode;
};

type MenuProps = {
  menu?: MenuItem[];
  selectable?: boolean;
  selectedKeys?: string[];
};

export type Props = XOR<ContentProps, MenuProps> & BaseProps;

const Dropdown: React.FC<Props> = ({
  children,
  content,
  disabled,
  isContextMenu,
  menu = [],
  open,
  autoWidthOverlay,
  placement = 'bottomLeft',
  onClick,
  onOpenChange,
  selectable,
  selectedKeys,
}) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();

  const addFocusToMenu = useCallback((menuItem: MenuItem): MenuItem => {
    if (menuItem === null || menuItem.type === 'divider') {
      //
    } else if (menuItem.type === 'group') {
      menuItem.children.forEach(addFocusToMenu);
    } else {
      menuItem.tabIndex = 0;
    }
  }, []);

  const antdMenu: AntdMenuProps = useMemo(() => {
    menu.forEach(addFocusToMenu);
    return {
      items: menu,
      onClick: (info) =>
        onClick?.(info.key, info.domEvent),
        // info.domEvent.stopPropagation();
      selectable,
      selectedKeys,
    };
  }, [addFocusToMenu, menu, onClick, selectable, selectedKeys]);
  const overlayStyle = autoWidthOverlay ? { minWidth: 'auto' } : undefined;
  const className = [css.base, themeClass].join(' ');
  /**
   * Using `dropdownRender` for Dropdown causes some issues with triggering the dropdown.
   * Instead, Popover is used when rendering content (as opposed to menu).
   */
  return content ? (
    <AntdPopover
      className={className}
      content={content}
      open={open}
      overlayClassName={themeClass}
      overlayStyle={overlayStyle}
      placement={placement}
      showArrow={false}
      trigger={["click", "contextMenu"]}
      onOpenChange={onOpenChange}>
      {children}
    </AntdPopover>
  ) : (
    <AntDropdown
      className={className}
      disabled={disabled}
      menu={antdMenu}
      open={open}
      overlayClassName={themeClass}
      overlayStyle={overlayStyle}
      placement={placement}
      trigger={[isContextMenu ? 'contextMenu' : 'click']}
      onOpenChange={onOpenChange}>
      {children}
    </AntDropdown>
  );
};

export default Dropdown;
