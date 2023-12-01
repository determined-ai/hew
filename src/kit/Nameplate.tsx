import React, { useLayoutEffect, useMemo, useState } from 'react';

import Icon, { IconName, IconSize } from 'kit/Icon';
import { useTheme } from 'kit/Theme';
import { Body } from 'kit/Typography';

import useResize from './internal/useResize';
import css from './Nameplate.module.scss';

export interface Props {
  alias?: string;
  compact?: boolean;
  icon: IconName | React.ReactElement;
  iconSize?: IconSize;
  name: string;
}

const Nameplate: React.FC<Props> = ({ alias, compact, icon, iconSize, name }) => {
  const { size, refCallback } = useResize();
  const [tooltip, setTooltip] = useState(true);
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classnames = [css.base, themeClass];
  if (compact) classnames.push(css.compact);

  const iconComponent = useMemo(() => {
    if (typeof icon === 'string') {
      return <Icon decorative name={icon} size={iconSize} />;
    } else return icon;
  }, [icon, iconSize]);

  useLayoutEffect(() => {
    // This should prevent unnecessary tooltips from appearing after width changes.
    setTooltip(false);
    const timer = setTimeout(() => {
      setTooltip(true);
    }, 5);
    return () => clearTimeout(timer);
  }, [size]);

  return (
    <div className={classnames.join(' ')} ref={refCallback}>
      <div className={css.icon}>{iconComponent}</div>
      <div className={css.text}>
        {alias && <Body truncate={{ rows: 1, tooltip }}>{alias}</Body>}
        <Body truncate={{ rows: 1, tooltip }}>{name}</Body>
      </div>
    </div>
  );
};

export default Nameplate;
