import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ListItem, Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import screenfull from 'screenfull';
import { sprintf } from 'sprintf-js';
import { throttle } from 'throttle-debounce';

import Button from 'kit/Button';
import ClipboardButton from 'kit/ClipboardButton';
import Column from 'kit/Column';
import Icon from 'kit/Icon';
import { clone, dateTimeStringSorter, formatDatetime, numericSorter } from 'kit/internal/functions';
import { readLogStream } from 'kit/internal/services';
import { FetchArgs, Log, LogLevel, RecordKey } from 'kit/internal/types';
import Message from 'kit/Message';
import Row from 'kit/Row';
import Section from 'kit/Section';
import Spinner from 'kit/Spinner';
import { ErrorHandler } from 'kit/utils/error';
import { ValueOf } from 'kit/utils/types';

import css from './LogViewer.module.scss';
import LogViewerEntry, { DATETIME_FORMAT, MAX_DATETIME_LENGTH } from './LogViewerEntry';

export interface Props<T> {
  decoder: (data: T) => Log;
  handleCloseLogs?: () => void;
  height?: number | 'stretch';
  initialLogs?: T[];
  onDownload?: () => void;
  onFetch?: (config: FetchConfig, type: FetchType) => FetchArgs;
  onError: ErrorHandler;
  serverAddress: (path: string) => string;
  sortKey?: keyof Log;
  title?: React.ReactNode;
}

export interface ViewerLog extends Log {
  formattedTime: string;
}

type Hash = Record<RecordKey, boolean>;

export interface FetchConfig {
  canceler: AbortController;
  fetchDirection: FetchDirection;
  limit: number;
  offset?: number;
  offsetLog?: Log;
}

export const FetchType = {
  Initial: 'Initial',
  Newer: 'Newer',
  Older: 'Older',
  Stream: 'Stream',
} as const;

export type FetchType = ValueOf<typeof FetchType>;

export const FetchDirection = {
  Newer: 'Newer',
  Older: 'Older',
} as const;

export type FetchDirection = ValueOf<typeof FetchDirection>;

export const ARIA_LABEL_ENABLE_TAILING = 'Enable Tailing';
export const ARIA_LABEL_SCROLL_TO_OLDEST = 'Scroll to Oldest';

const PAGE_LIMIT = 100;
const THROTTLE_TIME = 50;

const defaultLocal = {
  fetchOffset: -PAGE_LIMIT,
  idMap: {} as Hash,
  isFetching: false,
  isScrollReady: false,
};

export const formatLogEntry = (log: Log): ViewerLog => {
  const formattedTime = log.time ? formatDatetime(log.time, { format: DATETIME_FORMAT }) : '';
  return { ...log, formattedTime };
};

const formatClipboardHeader = (log: Log): string => {
  const logEntry = formatLogEntry(log);
  const format = `%${MAX_DATETIME_LENGTH - 1}s `;
  const level = `<${logEntry.level || ''}>`;
  return sprintf(`%-9s ${format}`, level, logEntry.formattedTime);
};

const logSorter =
  (key: keyof Log) =>
  (a: Log, b: Log): number => {
    const aValue = a[key];
    const bValue = b[key];
    if (key === 'id') return numericSorter(aValue as number, bValue as number);
    if (key === 'time') return dateTimeStringSorter(aValue as string, bValue as string);
    return 0;
  };

// This is an arbitrarily large number used as an index. See https://virtuoso.dev/prepend-items/
const START_INDEX = 2_000_000_000;

function LogViewer<T>({
  decoder,
  height = 'stretch',
  initialLogs,
  onDownload,
  onFetch,
  onError,
  serverAddress,
  sortKey = 'time',
  handleCloseLogs,
  ...props
}: Props<T>): JSX.Element {
  const logsRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [isFetching, setIsFetching] = useState(false);
  const local = useRef(clone(defaultLocal));
  const [canceler] = useState(new AbortController());
  const [fetchDirection, setFetchDirection] = useState<FetchDirection>(FetchDirection.Older);
  const [isTailing, setIsTailing] = useState<boolean>(true);
  const [showButtons, setShowButtons] = useState(false);
  const [logs, setLogs] = useState<ViewerLog[]>([]);
  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX);

  const processLogs = useCallback(
    (newLogs: Log[]) => {
      const map = local.current.idMap;
      return newLogs
        .filter((log) => {
          const isDuplicate = map[log.id];
          const isTqdm = log.message.includes('\r');
          map[log.id] = true;
          return !isDuplicate && !isTqdm;
        })
        .map((log) => formatLogEntry(log))
        .sort(logSorter(sortKey));
    },
    [sortKey],
  );

  const addLogs = useCallback((newLogs: ViewerLog[] = [], prepend = false): void => {
    if (newLogs.length === 0) return;
    setLogs((prevLogs) => (prepend ? newLogs.concat(prevLogs) : prevLogs.concat(newLogs)));
    if (prepend) setFirstItemIndex((prev) => prev - newLogs.length);
  }, []);

  const fetchLogs = useCallback(
    async (config: Partial<FetchConfig>, type: FetchType): Promise<ViewerLog[]> => {
      if (!onFetch) return [];

      const buffer: Log[] = [];

      setIsFetching(true);
      local.current.isFetching = true;

      await readLogStream(
        serverAddress,
        onFetch({ limit: PAGE_LIMIT, ...config } as FetchConfig, type),
        onError,

        (event: T) => {
          const logEntry = decoder(event);
          fetchDirection === FetchDirection.Older
            ? buffer.unshift(logEntry)
            : buffer.push(logEntry);
        },
      );

      setIsFetching(false);
      local.current.isFetching = false;

      return processLogs(buffer);
    },
    [decoder, fetchDirection, onFetch, onError, processLogs, serverAddress],
  );

  const handleFetchMoreLogs = useCallback(
    async (positionReached: 'start' | 'end') => {
      // Scroll may occur before the initial logs have rendered.
      if (!local.current.isScrollReady) return;

      // Still busy with a previous fetch, prevent another fetch.
      if (local.current.isFetching) return;

      // Detect when user scrolls to the "edge" and requires more logs to load.
      const shouldFetchNewLogs =
        positionReached === 'end' && fetchDirection === FetchDirection.Newer;
      const shouldFetchOldLogs =
        positionReached === 'start' && fetchDirection === FetchDirection.Older;

      if (shouldFetchNewLogs || shouldFetchOldLogs) {
        const newLogs = await fetchLogs(
          {
            canceler,
            fetchDirection,
            offsetLog: shouldFetchNewLogs ? logs[logs.length - 1] : logs[0],
          },
          shouldFetchNewLogs ? FetchType.Newer : FetchType.Older,
        );

        addLogs(newLogs, shouldFetchOldLogs);

        /**
         * The user has scrolled all the way to the newest entry,
         * enable tailing behavior.
         */
        if (newLogs.length === 0 && shouldFetchNewLogs) {
          setIsTailing(true);
          setFetchDirection(FetchDirection.Older);
        }
      }
    },
    [addLogs, canceler, fetchDirection, fetchLogs, logs],
  );

  const handleScrollToOldest = useCallback(() => {
    setIsTailing(false);

    if (fetchDirection === FetchDirection.Newer) {
      virtuosoRef.current?.scrollToIndex({ index: firstItemIndex });
    } else {
      local.current = Object.assign(local.current, {
        fetchOffset: 0,
        idMap: {},
        isScrollReady: false,
      });

      setLogs([]);
      setFetchDirection(FetchDirection.Newer);
      setFirstItemIndex(0);
    }
  }, [fetchDirection, firstItemIndex]);

  const handleEnableTailing = useCallback(() => {
    setIsTailing(true);

    if (fetchDirection === FetchDirection.Older) {
      virtuosoRef.current?.scrollToIndex({ index: 'LAST' });
    } else {
      local.current = Object.assign(local.current, {
        fetchOffset: -PAGE_LIMIT,
        idMap: {},
        isScrollReady: false,
      });

      setLogs([]);
      setFetchDirection(FetchDirection.Older);
      setFirstItemIndex(START_INDEX);
    }
  }, [fetchDirection]);

  const clipboardCopiedMessage = useMemo(() => {
    const linesLabel = logs.length === 1 ? 'entry' : 'entries';
    return `Copied ${logs.length} ${linesLabel}!`;
  }, [logs]);

  const getClipboardContent = useCallback(() => {
    return logs.map((log) => `${formatClipboardHeader(log)}${log.message || ''}`).join('\n');
  }, [logs]);

  const handleFullScreen = useCallback(() => {
    if (logsRef.current && screenfull.isEnabled) screenfull.toggle();
  }, []);

  const handleDownload = useCallback(() => {
    onDownload?.();
  }, [onDownload]);

  // Fetch initial logs on a mount or when the mode changes.
  useEffect(() => {
    fetchLogs({ canceler, fetchDirection }, FetchType.Initial).then((logs) => {
      addLogs(logs, false);

      // Slight delay on scrolling to the end for the log viewer to render and resolve everything.
      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({
          index: fetchDirection === FetchDirection.Older ? 'LAST' : 0,
        });
        local.current.isScrollReady = true;
      }, 200);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canceler, fetchDirection]);

  // Enable streaming for loading latest entries.
  useEffect(() => {
    const canceler = new AbortController();
    let buffer: Log[] = [];

    const processBuffer = () => {
      const logs = processLogs(buffer);
      buffer = [];

      addLogs(logs);
    };
    const throttledProcessBuffer = throttle(THROTTLE_TIME, processBuffer);

    if (fetchDirection === FetchDirection.Older && onFetch) {
      readLogStream(
        serverAddress,
        onFetch({ canceler, fetchDirection, limit: PAGE_LIMIT }, FetchType.Stream),
        onError,
        (event: T) => {
          buffer.push(decoder(event));
          throttledProcessBuffer();
        },
      );
    }

    return () => {
      canceler.abort();
      throttledProcessBuffer.cancel();
    };
  }, [addLogs, decoder, fetchDirection, onError, serverAddress, onFetch, processLogs]);

  // Re-fetch logs when fetch callback changes.
  useEffect(() => {
    local.current = clone(defaultLocal);

    setLogs([]);
    setIsTailing(true);
    setFetchDirection(FetchDirection.Older);
    setFirstItemIndex(START_INDEX);
  }, [onFetch]);

  // Initialize logs if applicable.
  useEffect(() => {
    addLogs(processLogs(initialLogs?.map((log) => decoder(log)) ?? []));
  }, [addLogs, decoder, initialLogs, processLogs]);

  // Abort all outstanding API calls if log viewer unmounts.
  useEffect(() => {
    return () => {
      canceler.abort();
    };
  }, [canceler]);

  const handleItemsRendered = useCallback(
    (renderedLogs: ListItem<ViewerLog>[]) => {
      setShowButtons(renderedLogs.length < logs.length);
    },
    [logs.length],
  );

  const handleEndReached = useCallback(() => {
    console.log('end reached');
    handleFetchMoreLogs('end');
  }, [handleFetchMoreLogs]);

  const handleStartReached = useCallback(() => {
    console.log('start reached');
    handleFetchMoreLogs('start');
  }, [handleFetchMoreLogs]);

  const handleToggleTailing = useCallback((atBottom: boolean) => {
    console.log({ atBottom });
    setIsTailing(atBottom);
  }, []);

  /*
   * This overwrites the copy to clipboard event handler for the purpose of modifying the user
   * selected content. By default when copying content from a collection of HTML elements, each
   * element content will have a newline appended in the clipboard content. This handler will
   * detect which lines within the copied content to be the timestamp content and strip out the
   * newline from that field.
   */
  useLayoutEffect(() => {
    if (!logsRef.current) return;

    const target = logsRef.current;
    const handleCopy = (e: ClipboardEvent): void => {
      const clipboardFormat = 'text/plain';
      const levelValues = Object.values(LogLevel).join('|');
      const levelRegex = new RegExp(`<\\[(${levelValues})\\]>\n`, 'gim');
      const selection = (window.getSelection()?.toString() || '').replace(levelRegex, '<$1> ');
      const lines = selection?.split('\n');

      if (lines?.length <= 1) {
        e.clipboardData?.setData(clipboardFormat, selection);
      } else {
        const oddOrEven = lines
          .map((line) => /^\[/.test(line) || /\]$/.test(line))
          .reduce(
            (acc, isTimestamp, index) => {
              if (isTimestamp) acc[index % 2 === 0 ? 'even' : 'odd']++;
              return acc;
            },
            { even: 0, odd: 0 },
          );
        const isEven = oddOrEven.even > oddOrEven.odd;
        const content = lines.reduce((acc, line, index) => {
          const skipNewline = (isEven && index % 2 === 0) || (!isEven && index % 2 === 1);
          return acc + line + (skipNewline ? ' ' : '\n');
        }, '');
        e.clipboardData?.setData(clipboardFormat, content);
      }
      e.preventDefault();
    };

    target.addEventListener('copy', handleCopy);

    return (): void => target?.removeEventListener('copy', handleCopy);
  }, [logsRef]);

  return (
    <Section fullHeight>
      <div className={css.options}>
        <Row>
          <Column width="shrink">{props.title}</Column>
          <Column align="right">
            <Row>
              <ClipboardButton
                copiedMessage={clipboardCopiedMessage}
                getContent={getClipboardContent}
              />
              <Button
                aria-label="Toggle Fullscreen Mode"
                icon={<Icon name="fullscreen" showTooltip title="Toggle Fullscreen Mode" />}
                onClick={handleFullScreen}
              />
              {handleCloseLogs && (
                <Button
                  aria-label="Close Logs"
                  icon={<Icon name="close" title="Close Logs" />}
                  onClick={handleCloseLogs}
                />
              )}
              {onDownload && (
                <Button
                  aria-label="Download Logs"
                  icon={<Icon name="download" showTooltip title="Download Logs" />}
                  onClick={handleDownload}
                />
              )}
            </Row>
          </Column>
        </Row>
      </div>
      <Spinner center spinning={isFetching}>
        <div className={css.base} style={{ height: height === 'stretch' ? '100%' : `${height}px` }}>
          <div className={css.logs} ref={logsRef}>
            {logs.length > 0 ? (
              <Virtuoso
                atBottomStateChange={handleToggleTailing}
                customScrollParent={logsRef.current || undefined}
                data={logs}
                endReached={handleEndReached}
                firstItemIndex={firstItemIndex}
                followOutput={true}
                initialTopMostItemIndex={
                  fetchDirection === FetchDirection.Older
                    ? (initialLogs?.length ?? PAGE_LIMIT) - 1
                    : 0
                }
                itemContent={(_index, logEntry) => (
                  <LogViewerEntry
                    formattedTime={logEntry.formattedTime}
                    level={logEntry.level}
                    message={logEntry.message}
                  />
                )}
                itemsRendered={handleItemsRendered}
                ref={virtuosoRef}
                startReached={handleStartReached}
              />
            ) : (
              <Message icon="warning" title="No logs to show. " />
            )}
          </div>
          <div className={css.buttons} style={{ display: showButtons ? 'flex' : 'none' }}>
            <Button
              aria-label={ARIA_LABEL_SCROLL_TO_OLDEST}
              icon={<Icon name="arrow-up" showTooltip title={ARIA_LABEL_SCROLL_TO_OLDEST} />}
              onClick={handleScrollToOldest}
            />
            <Button
              aria-label={ARIA_LABEL_ENABLE_TAILING}
              icon={
                <Icon
                  name="arrow-down"
                  showTooltip
                  title={isTailing ? 'Tailing Enabled' : ARIA_LABEL_ENABLE_TAILING}
                />
              }
              onClick={handleEnableTailing}
            />
          </div>
        </div>
      </Spinner>
    </Section>
  );
}

export default LogViewer;
