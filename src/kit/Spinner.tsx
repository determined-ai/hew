import { Spin } from 'antd';
import React from 'react';

import Icon, { IconSize } from 'kit/Icon';
import { useTheme } from 'kit/internal/Theme/theme';
import { Loadable } from 'kit/utils/loadable';
import { XOR } from 'kit/utils/types';

import css from './Spinner.module.scss';

interface PropsBase {
  center?: boolean;
  size?: IconSize;
  tip?: React.ReactNode;
}

type Props<T> = XOR<
  {
    children?: React.ReactNode;
    conditionalRender?: boolean;
    spinning?: boolean;
  },
  {
    children: (data: T) => JSX.Element;
    data: Loadable<T>;
  }
> &
  PropsBase;

function Spinner<T>({
  center,
  children,
  conditionalRender,
  size = 'medium',
  spinning = true,
  tip,
  data,
}: Props<T>): JSX.Element {
  const { themeSettings: { className } } = useTheme();
  const classes = [className, css.base];

  if (center || tip) classes.push(css.center);

  const spinner = (
    <div className={classes.join(' ')}>
      <Spin
        data-testid="custom-spinner"
        indicator={
          <div className={css.spin}>
            <Icon name="spinner" size={size} title="Spinner" />
          </div>
        }
        spinning={spinning}
        tip={tip}>
        {data !== undefined || (conditionalRender && spinning) ? null : children}
      </Spin>
    </div>
  );

  if (!data) {
    return spinner;
  } else {
    return Loadable.match(data, {
      Failed: () => <></>,
      Loaded: children,
      NotLoaded: () => spinner, // TODO circle back with design to find an appropriate error state here
    });
  }
}

export default Spinner;
