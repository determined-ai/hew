import { render } from '@testing-library/react';

import { generateAlphaNumeric } from 'kit/internal/functions';
import { DefaultTheme, UIProvider } from 'kit/Theme';

import Badge, { BadgeProps } from './Badge';

const CONTENT = generateAlphaNumeric();

const setup = (props: BadgeProps = { text: CONTENT }) => {
  return render(
    <UIProvider theme={DefaultTheme.Light}>
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
