import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import UIProvider, { DefaultTheme } from 'kit/Theme';

import Avatar, { Props } from './Avatar';

vi.mock('kit/Tooltip');
const user = userEvent.setup();

const setup = ({ hideTooltip = false, ...props }: Props) => {
  render(
    <UIProvider theme={DefaultTheme.Light}>
      <Avatar hideTooltip={hideTooltip} {...props} />
    </UIProvider>,
  );
};

describe('Avatar', () => {
  const displayName = 'Bugs Bunny';
  const initials = 'BB';

  it('should display initials of name', async () => {
    setup({ text: displayName });

    expect(await screen.findByText(initials)).toBeInTheDocument();
  });

  it('should display name on hover', async () => {
    setup({ text: displayName });

    await user.hover(await screen.findByText(initials));

    expect(await screen.findByText(displayName)).toBeInTheDocument();
  });

  it('shouldnt display name on hover if hideTooltip is true', async () => {
    setup({ hideTooltip: true, text: displayName });

    await user.hover(await screen.findByText(initials));

    expect(screen.queryByText(displayName)).not.toBeInTheDocument();
  });
});
