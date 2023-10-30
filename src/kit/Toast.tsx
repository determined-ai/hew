import { notification as antdNotification } from 'antd';
import { useAppProps } from 'antd/es/app/context';
import React, { RefObject } from 'react';

import Icon, { IconName } from './Icon';
import css from './Toast.module.scss';

/**
 * Wrapper for static dialog functionality from antd. Regular static instances
 * are not responsive to the theming context, and will appear with the default
 * styling, so we use the app context from antd which hooks into the context.
 * This requires our code to call the `App.useApp` hook somewhere, so we do that
 * in the AppView. We fall back to the vanilla static methods so testing
 * functionality isn't broken.
 */

const notification: useAppProps['notification'] = antdNotification;
export { notification };
export type Severity = 'Info' | 'Confirm' | 'Warning' | 'Error';

export type ToastArgs = {
  title: string;
  severity?: Severity;
  description?: string;
  link?: React.ReactNode;
  closeable?: boolean;
  duration?: number;
  containerRef: RefObject<HTMLElement>;
};

const getIconName = (s: Severity): IconName => {
  if (s === 'Confirm') return 'checkmark';
  return s.toLowerCase() as IconName;
};

export const makeToast = ({
  title,
  severity = 'Info',
  closeable = true,
  duration = 4.5,
  description,
  link,
  containerRef,
}: ToastArgs): void => {
  const args = {
    closeIcon: closeable ? <Icon decorative name="close" /> : null,
    description: description ? (
      link ? (
        <div>
          <p>{description}</p>
          {link}
        </div>
      ) : (
        description
      )
    ) : undefined,
    duration,
    message: (
      <div className={css.message}>
        <Icon decorative name={getIconName(severity)} />
        {title}
      </div>
    ),
  };
  antdNotification.config({
    getContainer: () => (containerRef.current ? containerRef.current : document.body),
  });
  const notification: useAppProps['notification'] = antdNotification;
  notification.open(args);
};
