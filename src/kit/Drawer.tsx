import { Drawer } from 'antd';
import React, { useRef } from 'react';

import Button from 'kit/Button';
import Icon from 'kit/Icon';

import css from './Drawer.module.scss';
import { findParentByClass } from './internal/functions';

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
  const elementRef = useRef(null);
  return (
    <div ref={elementRef}>
      <Drawer
        bodyStyle={{ padding: 0 }}
        closable={false}
        getContainer={() =>
          findParentByClass(elementRef.current ? elementRef.current : document.body, 'ui-provider')
        }
        maskClosable={maskClosable}
        open={open}
        placement={placement}
        rootClassName={css.mobileWidth}
        width="700px"
        onClose={onClose}>
        <div className={css.header} ref={elementRef}>
          <div className={css.headerTitle}>{title}</div>
          <Button
            icon={<Icon name="close" size="small" title="Close drawer" />}
            type="text"
            onClick={onClose}
          />
        </div>
        <div className={css.body}>{children}</div>
      </Drawer>
    </div>
  );
};

export default DrawerComponent;
