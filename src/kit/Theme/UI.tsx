import { StyleProvider } from '@ant-design/cssinjs';
import { theme as AntdTheme, ConfigProvider } from 'antd';
import React, { useLayoutEffect, useRef } from 'react';

import { UIContext } from 'kit/internal/theme';
import { RecordKey } from 'kit/internal/types';

import { globalCssVars, Theme } from './themeUtils';

export { StyleProvider };
export type { Theme };

const camelCaseToKebab = (text: string): string => {
  return text
    .trim()
    .split('')
    .map((char, index) => {
      return char === char.toUpperCase() ? `${index !== 0 ? '-' : ''}${char.toLowerCase()}` : char;
    })
    .join('');
};

export const UIProvider: React.FC<{
  children?: React.ReactNode;
  themeIsDark?: boolean;
  theme: Theme;
}> = ({ children, theme, themeIsDark = false }) => {
  const ref = useRef(null);
  return (
    <UIContext.Provider value={{ ref, theme, themeIsDark }}>
      <UI theme={theme} themeIsDark={themeIsDark}>
        <div ref={ref}>{children}</div>
      </UI>
    </UIContext.Provider>
  );
};

export const UI: React.FC<{
  children?: React.ReactNode;
  themeIsDark?: boolean;
  theme: Theme;
}> = ({ children, theme, themeIsDark = false }) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Set global CSS variables shared across themes.
    Object.keys(globalCssVars).forEach((key) => {
      const value = (globalCssVars as Record<RecordKey, string>)[key];
      document.documentElement.style.setProperty(`--${camelCaseToKebab(key)}`, value);
    });

    // Set each theme property as top level CSS variable.
    Object.keys(theme).forEach((key) => {
      const value = (theme as Record<RecordKey, string>)[key];
      ref.current?.style.setProperty(`--theme-${camelCaseToKebab(key)}`, value);
    });

    /**
     * A few specific HTML elements and free form text entries
     * within the application are styled based on the color-scheme
     * css property set specifically on the documentElement.
     *
     * Examples include:
     *  - the "Section" titles in the Drawer component which are
     *    <h5> elements.
     * - The "Settings" section title within the Drawer which is
     *   free form text.
     * - The Paragraph component within the Drawer.
     * - The "ThemeToggle" mode text on the DesignKit page.
     *
     *  the following line is needed to ensure styling in these
     *  specific cases is still applied correctly.
     */
    document.documentElement.style.setProperty('color-scheme', themeIsDark ? 'dark' : 'light');
  }, [theme, themeIsDark]);

  const lightThemeConfig = {
    components: {
      Tooltip: {
        colorBgDefault: 'var(--theme-float)',
        colorTextLightSolid: 'var(--theme-float-on)',
      },
    },
    token: {
      colorPrimary: '#1890ff',
    },
  };

  const darkThemeConfig = {
    components: {
      Checkbox: {
        colorBgContainer: 'transparent',
      },
      DatePicker: {
        colorBgContainer: 'transparent',
      },
      Input: {
        colorBgContainer: 'transparent',
      },
      InputNumber: {
        colorBgContainer: 'transparent',
      },
      Modal: {
        colorBgElevated: 'var(--theme-stage)',
      },
      Pagination: {
        colorBgContainer: 'transparent',
      },
      Radio: {
        colorBgContainer: 'transparent',
      },
      Select: {
        colorBgContainer: 'transparent',
      },
      Tree: {
        colorBgContainer: 'transparent',
      },
    },
    token: {
      colorLink: '#57a3fa',
      colorLinkHover: '#8dc0fb',
      colorPrimary: '#1890ff',
    },
  };

  const baseThemeConfig = {
    components: {
      Button: {
        colorBgContainer: 'transparent',
      },
      Progress: {
        marginXS: 0,
      },
    },
    token: {
      borderRadius: 2,
      fontFamily: 'var(--theme-font-family)',
    },
  };

  const algorithm = themeIsDark ? AntdTheme.darkAlgorithm : AntdTheme.defaultAlgorithm;
  const { token: baseToken, components: baseComponents } = baseThemeConfig;
  const { token, components } = themeIsDark ? darkThemeConfig : lightThemeConfig;

  const configTheme = {
    algorithm,
    components: {
      ...baseComponents,
      ...components,
    },
    token: {
      ...baseToken,
      ...token,
    },
  };

  return (
    <div className="ui-provider" ref={ref}>
      <ConfigProvider theme={configTheme}>{children}</ConfigProvider>
    </div>
  );
};

export default UIProvider;
