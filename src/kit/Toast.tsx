import { notification as antdNotification, App } from 'antd';
import { useAppProps } from 'antd/es/app/context';
import { useEffect, useLayoutEffect, useRef } from 'react';

import { useTheme } from 'kit/internal/Theme/theme';

import Icon, { IconName } from './Icon';
import { findParentByClass } from './internal/functions';
import UIProvider from './Theme';
import css from './Toast.module.scss';

/**
 * Wrapper for static dialog functionality from antd. Regular static instances
 * are not responsive to the theming context, and will appear with the default
 * styling, so we use the app context from antd which hooks into the context.
 * This requires our code to call the `App.useApp` hook somewhere, so we do that
 * in the AppView. We fall back to the vanilla static methods so testing
 * functionality isn't broken.
 */

let notification: useAppProps['notification'] = antdNotification;

export const useInitApi = (): void => {
  const api = App.useApp();
  // minimize reassignments
  useEffect(() => {
    ({ notification } = api);
  }, [api]);
};

export { notification };

export type Severity = 'Info' | 'Confirm' | 'Warning' | 'Error';

export type ToastArgs = {
  title: string;
  severity?: Severity;
  description?: string;
  link?: React.ReactNode;
  closeable?: boolean;
  duration?: number;
};

type Props = {
  children: React.ReactNode;
  themeClass?: string;
};

const ToastThemeProvider: React.FC<Props> = ({ children, themeClass }: Props) => {
  const ref = useRef(null);
  const {
    themeSettings: { className },
  } = useTheme();
  const themeClassName = themeClass ? themeClass : className;
  useLayoutEffect(() => {
    if (ref.current) {
      const notificationContainer = findParentByClass(ref.current, 'ant-notification');
      notificationContainer.classList.add(themeClassName);
    }
  });
  return <div ref={ref}>{children}</div>;
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
      <ToastThemeProvider>
        <div className={css.message}>
          <Icon decorative name={getIconName(severity)} />
          {title}
        </div>
      </ToastThemeProvider>
    ),
  };
  notification.open(args);
};

export const useToast = (): any => {
  const {
    themeSettings: { theme, themeIsDark, className: themeClass },
  } = useTheme();

  const openToast = ({
    title,
    severity = 'Info',
    closeable = true,
    duration = 4.5,
    description,
    link,
  }: ToastArgs) => {
    const args = {
      closeIcon: closeable ? (
        <UIProvider theme={theme} themeIsDark={themeIsDark}>
          <Icon decorative name="close" />
        </UIProvider>
      ) : null,
      description: description ? (
        link ? (
          <UIProvider theme={theme} themeIsDark={themeIsDark}>
            <div>
              <p>{description}</p>
              {link}
            </div>
          </UIProvider>
        ) : (
          description
        )
      ) : undefined,
      duration,
      message: (
        <UIProvider theme={theme} themeIsDark={themeIsDark}>
          <ToastThemeProvider themeClass={themeClass}>
            <div className={css.message}>
              <Icon decorative name={getIconName(severity)} />
              {title}
            </div>
          </ToastThemeProvider>
        </UIProvider>
      ),
    };
    notification.open(args);
  };
  return { openToast };
};
