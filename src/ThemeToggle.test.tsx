import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Mode, ThemeProvider, UIProvider } from 'kit/Theme';

import ThemeToggle, { ThemeOptions } from './ThemeToggle';
import { themeLightDetermined } from 'kit/internal/theme';

const ThemeToggleContainer: React.FC = () => (
  <ThemeProvider>
    <UIProvider theme={themeLightDetermined}>
      <ThemeToggle />
    </UIProvider>
  </ThemeProvider>
);

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
