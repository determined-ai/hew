import { Drawer } from 'antd';
import React from 'react';

import Button from 'kit/Button';
import Icon from 'kit/Icon';
import { useTheme } from 'kit/internal/Theme/theme';

import css from './Drawer.module.scss';

type DrawerPlacement = 'left' | 'right';

interface DrawerProps {
  children: React.ReactNode;
  maskClosable?: boolean;
  open: boolean;
  placement: DrawerPlacement;
  title: string;
  onClose: () => void;
}

const DrawerComponent: React.FC<DrawerProps> = ({
  children,
  maskClosable = true,
  open,
  placement,
  title,
  onClose,
}) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const rootClasses = [css.mobileWidth, themeClass];
  return (
    <Drawer
      bodyStyle={{ padding: 0 }}
      closable={false}
      maskClosable={maskClosable}
      open={open}
      placement={placement}
      rootClassName={rootClasses.join(' ')}
      width="700px"
      onClose={onClose}>
      <div className={css.header}>
        <div className={css.headerTitle}>{title}</div>
        <Button
          icon={<Icon name="close" size="small" title="Close drawer" />}
          type="text"
          onClick={onClose}
        />
      </div>
      <div className={css.body}>{children}</div>
    </Drawer>
  );
};

export default DrawerComponent;
