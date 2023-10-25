import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { generateAlphaNumeric } from 'kit/internal/functions';
import { UIProvider } from 'kit/Theme';

import Badge, { BadgeProps } from './Badge';

const CONTENT = generateAlphaNumeric();

const user = userEvent.setup();

const setup = (props: BadgeProps = { text: CONTENT }) => {
  return render(
    <UIProvider>
      <Badge {...props} />
    </UIProvider>,
  );
};

describe('Badge', () => {
  it('should display content from children', () => {
    const view = setup();
    expect(view.getByText(CONTENT)).toBeInTheDocument();
  });
});
