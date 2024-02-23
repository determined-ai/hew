import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';

import { Log } from 'kit/internal/types';
import LogViewer, {
  ARIA_LABEL_ENABLE_TAILING,
  ARIA_LABEL_SCROLL_TO_OLDEST,
  Props,
} from 'kit/LogViewer/LogViewer';
import { DefaultTheme, UIProvider } from 'kit/Theme';

const VISIBLE_LINES = 50;

const setup = (props: Props<Log>) => {
  const user = userEvent.setup();
  const { container } = render(
    <UIProvider theme={DefaultTheme.Light}>
      <LogViewer {...props} />
    </UIProvider>,
    {
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ itemHeight: 20, viewportHeight: 20 * VISIBLE_LINES }}>
          {children}
        </VirtuosoMockContext.Provider>
      ),
    },
  );
  return { container, user };
};

describe('LogViewer', () => {
  const decoder = (l: unknown) => l as Log;
  const serverAddress = () => 'http://latest-main.determined.ai:8080/det';
  const handleError = (e: unknown) => console.error(e);
  describe('static logs', () => {
    it('should hide scrolling buttons when log content is empty', async () => {
      setup({ decoder, onError: handleError, serverAddress });

      await waitFor(() => {
        expect(
          screen.queryByLabelText(ARIA_LABEL_SCROLL_TO_OLDEST, {
            selector: 'button',
          }),
        ).not.toBeVisible();
        expect(
          screen.queryByLabelText(ARIA_LABEL_ENABLE_TAILING, {
            selector: 'button',
          }),
        ).not.toBeVisible();
      });
    });

    it('should not show log close button by default', async () => {
      setup({ decoder, onError: handleError, serverAddress });

      await waitFor(() => {
        expect(
          screen.queryByLabelText('Close Logs', {
            selector: 'button',
          }),
        ).not.toBeInTheDocument();
      });
    });

    it('should show log close button when prop is supplied', async () => {
      const handleCloseLogs = () => {
        return;
      };
      setup({ decoder, handleCloseLogs, onError: handleError, serverAddress });

      await waitFor(() => {
        expect(
          screen.queryByLabelText('Close Logs', {
            selector: 'button',
          }),
        ).toBeInTheDocument();
      });
    });
  });
});
