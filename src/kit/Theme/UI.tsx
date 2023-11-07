import { StyleProvider } from '@ant-design/cssinjs';
import { theme as AntdTheme, ConfigProvider } from 'antd';
import React, { useContext, useEffect } from 'react';

import { RecordKey } from 'kit/internal/types';


import { globalCssVars, Theme, ThemeVariable } from './themeUtils';

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

interface ThemeSettings {
  className: string;
  themeIsDark: boolean;
  theme: Theme;
}

const UIContext = React.createContext<ThemeSettings | undefined>(undefined);

export const useTheme = (): { themeSettings: ThemeSettings, getThemeVar: (name: ThemeVariable) => string; } => {
  /**
   * Some UI Kit components such as the CodeEditor do not inherit the theme from css or page styling
   * and instead require us to set a theme related prop dynamically. This context allows us to
   * subscribe to UIProvider theme updates and re-render these child components with the correct
   * theme.
   */
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useStore(UI) must be used within a UIProvider');
  }

  const getThemeVar = (name: ThemeVariable): string => {
    return context.theme[name]
  }

  return { themeSettings: context, getThemeVar };
};


export const UIProvider: React.FC<{
  children?: React.ReactNode;
  themeIsDark?: boolean;
  theme: Theme;
}> = ({ children, theme, themeIsDark = false }) => {
  const className = `ui-provider-${Math.random().toString(36).substring(2, 9)}`;

  useEffect(() => {
    const styles: string[] = [];
    Object.keys(globalCssVars).forEach((key) => {
      const value = (globalCssVars as Record<RecordKey, string>)[key];
      if (value) {
        styles.push(`--${camelCaseToKebab(key)}:${value}`);
        document.documentElement.style.setProperty(`--${camelCaseToKebab(key)}`, value);
      }
    });

    Object.keys(theme).forEach((key) => {
      const value = (theme as Record<RecordKey, string>)[key];
      if (value) {
        styles.push(`--theme-${camelCaseToKebab(key)}:${value}`);
      }
    });
    styles.push(`color-scheme:${themeIsDark ? 'dark' : 'light'}`);
    const style = document.createElement('style');
    const styleString = `.${className}{${styles.join(';')}}`;
    style.textContent = styleString;
    document.head.appendChild(style);
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
    return () => { document.head.removeChild(style); };
  }, [className, theme, themeIsDark]);

  return (
    <UIContext.Provider value={{ className, theme, themeIsDark }}>
      <UI className={className} themeIsDark={themeIsDark}>
        {children}
      </UI>
    </UIContext.Provider>
  );
};

export const UI: React.FC<{
  children?: React.ReactNode;
  themeIsDark?: boolean;
  className: string;
}> = ({ children, className, themeIsDark = false }) => {
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
    <div className={className}>
      <ConfigProvider theme={configTheme}>{children}</ConfigProvider>
    </div>
  );
};

export default UIProvider;
