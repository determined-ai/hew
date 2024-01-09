import { StyleProvider } from '@ant-design/cssinjs';
import { theme as AntdTheme, ConfigProvider } from 'antd';
import React, { useContext, useEffect, useRef } from 'react';

import { globalCssVars, Theme, ThemeVariable } from './themeUtils';

export { StyleProvider };
export type { Theme };

export const camelCaseToKebab = (text: string): string => {
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

export const useTheme = (): {
  getThemeVar: (name: ThemeVariable) => string;
  themeSettings: ThemeSettings;
} => {
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
    return context.theme[name];
  };

  return { getThemeVar, themeSettings: context };
};

export const UIProvider: React.FC<{
  children?: React.ReactNode;
  themeIsDark?: boolean;
  theme: Theme;
  // low sets the specificity of the theme variables to 0, high sets the specificity to 10.
  priority?: 'low' | 'high';
}> = ({ children, theme, themeIsDark = false, priority = 'high' }) => {
  const className = `ui-provider-${Math.random().toString(36).substring(2, 9)}`;
  const classNameRef = useRef<string>(className);
  const fontThemes: ThemeVariable[] = ['fontFamily', 'fontFamilyCode', 'fontFamilyVar'];
  useEffect(() => {
    const styles: string[] = [`color-scheme:${themeIsDark ? 'dark' : 'light'}`];
    Object.entries(globalCssVars).forEach(([key, value]) => {
      if (value) document.documentElement.style.setProperty(`--${camelCaseToKebab(key)}`, value);
    });

    fontThemes.forEach((fontVar) => {
      if (theme?.[fontVar]) document.documentElement.style.setProperty(`--${camelCaseToKebab(fontVar)}`, theme[fontVar]);
    })

    Object.entries(theme).forEach(([key, value]) => {
      if (value) styles.push(`--theme-${camelCaseToKebab(key)}:${value}`);
    });

    let selector = `.${classNameRef.current}`;
    if (priority === 'low') selector = `:where(${selector})`;

    const style = document.createElement('style');
    const styleString = `${selector}{${styles.join(';')}}`;
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
    return () => {
      document.head.removeChild(style);
    };
  }, [theme, themeIsDark, priority]);

  return (
    <UIContext.Provider value={{ className: classNameRef.current, theme, themeIsDark }}>
      <UI className={classNameRef.current} themeIsDark={themeIsDark}>
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
