import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';

import { generateAlphaNumeric } from 'kit/internal/functions';
import { FetchArgs, Log, LogLevel, LogLevelFromApi } from 'kit/internal/types';
import LogViewer, {
  ARIA_LABEL_ENABLE_TAILING,
  ARIA_LABEL_SCROLL_TO_OLDEST,
  FetchConfig,
  FetchDirection,
  FetchType,
  Props,
} from 'kit/LogViewer/LogViewer';
import { DefaultTheme, UIProvider } from 'kit/Theme';

const DEFAULT_MIN_WORD_COUNT = 5;
const DEFAULT_MAX_WORD_COUNT = 8;
const DEFAULT_MIN_WORD_LENGTH = 3;
const DEFAULT_MAX_WORD_LENGTH = 12;
const LEVELS = Object.values(LogLevelFromApi) as string[];
const NOW = Date.now();

const VISIBLE_LINES = 50;

const generateMessage = (
  options: {
    maxWordCount?: number;
    maxWordLength?: number;
    minWordCount?: number;
    minWordLength?: number;
  } = {},
): string => {
  const minWordCount = options.minWordCount ?? DEFAULT_MIN_WORD_COUNT;
  const maxWordCount = options.maxWordCount ?? DEFAULT_MAX_WORD_COUNT;
  const minWordLength = options.minWordLength ?? DEFAULT_MIN_WORD_LENGTH;
  const maxWordLength = options.maxWordLength ?? DEFAULT_MAX_WORD_LENGTH;
  const count = Math.floor(Math.random() * (maxWordCount - minWordCount)) + minWordCount;
  const words = new Array(count).fill('').map(() => {
    const length = Math.floor(Math.random() * (maxWordLength - minWordLength)) + minWordLength;
    return generateAlphaNumeric(length);
  });
  return words.join(' ');
};

const generateLogs = (
  count = 1,
  startIndex = 0,
  nowIndex?: number, // when undefined, assumed the last generated log is now
): Log[] => {
  const dateIndex = nowIndex != null ? nowIndex : count - 1;
  return new Array(count).fill(null).map((_, i) => {
    const index = startIndex + i;
    const timeOffset = (dateIndex - index) * 1000;
    const timestamp = NOW - timeOffset;
    return {
      id: generateAlphaNumeric(),
      level: LEVELS[Math.floor(Math.random() * LEVELS.length)] as LogLevel,
      message: `index: ${index} - timestamp: ${timestamp} - ${generateMessage()}`,
      time: new Date(timestamp).toString(),
    };
  });
};

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

/**
 * canceler -        AbortController to manually stop ongoing API calls.
 * logsReference -   Allows tests to pass in an array to reflect the current state of loaded logs.
 * skipStreaming -   Disables the streaming portion of the mocked `readStream` function.
 * streamingRounds - How many rounds of stream chunks to simulate.
 */
const mockOnFetch = (
  mockOptions: {
    canceler?: AbortController;
    existingLogs?: Log[];
    logsReference?: Log[];
    skipStreaming?: boolean;
    streamingRounds?: number;
  } = {},
) =>
  vi.fn((config: FetchConfig, type: FetchType): FetchArgs => {
    const options = {
      existingLogs: mockOptions.existingLogs,
      follow: false,
      limit: config.limit,
      logsReference: mockOptions.logsReference,
      orderBy: 'ORDER_BY_UNSPECIFIED',
      signal: mockOptions.canceler?.signal,
      skipStreaming: mockOptions.skipStreaming,
      streamingRounds: mockOptions.streamingRounds,
      timestampAfter: '',
      timestampBefore: '',
    };

    if (type === FetchType.Initial) {
      options.orderBy =
        config.fetchDirection === FetchDirection.Older ? 'ORDER_BY_DESC' : 'ORDER_BY_ASC';
    } else if (type === FetchType.Newer) {
      options.orderBy = 'ORDER_BY_ASC';
      if (config.offsetLog?.time) options.timestampAfter = config.offsetLog.time;
    } else if (type === FetchType.Older) {
      options.orderBy = 'ORDER_BY_DESC';
      if (config.offsetLog?.time) options.timestampBefore = config.offsetLog.time;
    } else if (type === FetchType.Stream) {
      options.follow = true;
      options.limit = 0;
      options.orderBy = 'ORDER_BY_ASC';
      options.timestampAfter = new Date(NOW).toISOString();
    }

    return { options, url: 'byTime' };
  });

const findTimeLogIndex = (logs: Log[], timeString: string): number => {
  const timestamp = new Date(timeString).getTime().toString();
  return logs.findIndex((log) => log.message.includes(timestamp));
};

vi.mock('kit/internal/services', async (importOriginal) => {
  const mod = await importOriginal<typeof import('kit/internal/services')>();
  return {
    ...mod,
    readLogStream: vi.fn(
      (
        _serverAddress: (path: string) => string,
        { options }: FetchArgs,
        _onError: (e: unknown, options?: object) => void,
        onEvent: (event: unknown) => void,
      ): void => {
        // Default mocking options.
        const existingLogs = options.existingLogs ?? [];
        const skipStreaming = options.skipStreaming ?? true;
        const streamingRounds = options.streamingRounds ?? 100;
        const desc = options.orderBy === 'ORDER_BY_DESC';

        if (!options.follow) {
          const range = [0, existingLogs.length - 1];
          if (desc) {
            if (options.timestampBefore) {
              const before = findTimeLogIndex(existingLogs, options.timestampBefore);
              range[0] = before - options.limit;
              range[1] = before;
            } else {
              range[0] = existingLogs.length - options.limit;
              range[1] = existingLogs.length;
            }
          } else {
            if (options.timestampAfter) {
              const after = findTimeLogIndex(existingLogs, options.timestampAfter);
              range[0] = after + 1;
              range[1] = after + options.limit + 1;
            } else {
              range[0] = 0;
              range[1] = options.limit;
            }
          }
          const filteredLogs: Log[] = existingLogs.slice(range[0], range[1]);
          if (desc) filteredLogs.reverse();
          if (options.logsReference) options.logsReference.push(...filteredLogs);
          filteredLogs.forEach((log) => onEvent(log));
        } else if (options.follow && !skipStreaming) {
          let startIndex = existingLogs.length;
          let rounds = 0;
          while (rounds < streamingRounds) {
            const count = Math.floor(Math.random() * 4) + 1;
            const logs = generateLogs(count, startIndex, existingLogs.length - 1);
            if (options.logsReference) options.logsReference.push(...logs);
            logs.forEach((log) => onEvent(log));
            startIndex += count;
            rounds++;
          }
        }
      },
    ),
  };
});

describe('LogViewer', () => {
  beforeEach(() => {
    //vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

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
