import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';

import UIProvider, { DefaultTheme } from 'kit/Theme';
import { Mode } from 'kit/internal/theme';
import ThemeToggle, { ThemeOptions } from './ThemeToggle';

const ThemeToggleContainer: React.FC = () => {
  const [mode, setMode] = useState<Mode>(Mode.Light);

  return (
    <UIProvider theme={DefaultTheme.Light}>
      <ThemeToggle onChange={(mode: Mode) => setMode(mode)} mode={mode} />
    </UIProvider>
  );
};

const user = userEvent.setup();

const setup = () => render(<ThemeToggleContainer />);

describe('ThemeToggle', () => {
  it('should have system mode as the default setting', async () => {
    setup();
    const defaultOption = ThemeOptions[Mode.System];
    expect(await screen.findByText(defaultOption.displayName)).toBeInTheDocument();
  });

  it('should cycle through all the modes in the correct order', async () => {
    const optionCount = Object.keys(ThemeOptions).length;
    let option = ThemeOptions[Mode.System];

    setup();

    for (let i = 0; i < optionCount; i++) {
      expect(await screen.findByText(option.displayName)).toBeInTheDocument();
      await user.click(screen.getByText(option.displayName));
      option = ThemeOptions[option.next];
    }
  });
});
