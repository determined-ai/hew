import { isEqual } from 'lodash';
import React, { RefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import { throttle } from 'throttle-debounce';
import uPlot, { AlignedData } from 'uplot';

import Button from 'kit/Button';
import Icon from 'kit/Icon';
import { XAxisDomain } from 'kit/internal/types';
import useResize from 'kit/internal/useResize';
import { useChartSync } from 'kit/LineChart/SyncProvider';
import Spinner from 'kit/Spinner';
import { useTheme } from 'kit/Theme';
import { ErrorHandler, ErrorLevel, ErrorType } from 'kit/utils/error';
import usePrevious from 'kit/utils/usePrevious';

import { FacetedData } from './types';
import css from './UPlotChart.module.scss';

export interface Options extends Omit<uPlot.Options, 'width'> {
  key?: number;
  width?: number;
}

interface Props {
  allowDownload?: boolean;
  data?: AlignedData | FacetedData;
  experimentId?: number;
  isLoading?: boolean;
  options?: Partial<Options>;
  handleError?: ErrorHandler;
  xAxis?: XAxisDomain;
}

const SCROLL_THROTTLE_TIME = 500;

const shouldRecreate = (
  prev: Partial<Options> | undefined,
  next: Partial<Options> | undefined,
): boolean => {
  if (!next) return false;
  if (!prev) return true;
  if (prev === next) return false;
  if (prev.key !== next.key) return true;
  if (Object.keys(prev).length !== Object.keys(next).length) return true;

  if (prev.axes?.length !== next.axes?.length) return true;
  if (!isEqual(prev.plugins, next.plugins)) return true;
  if (prev?.series?.length !== next.series?.length) return true;

  const someScaleHasChanged = Object.entries(next.scales ?? {}).some(([scaleKey, nextScale]) => {
    const prevScale = prev?.scales?.[scaleKey];
    return prevScale?.distr !== nextScale?.distr;
  });

  if (someScaleHasChanged) return true;

  const someAxisHasChanged = prev.axes?.some((prevAxis, seriesIdx) => {
    const nextAxis = next.axes?.[seriesIdx];
    return (
      prevAxis.label !== nextAxis?.label ||
      prevAxis.stroke !== nextAxis?.stroke ||
      prevAxis.scale !== nextAxis?.scale
    );
  });
  if (someAxisHasChanged) return true;

  const someSeriesHasChanged = prev.series?.some((prevSerie, seriesIdx) => {
    const nextSerie = next.series?.[seriesIdx];

    return (
      (nextSerie?.label != null && prevSerie?.label !== nextSerie?.label) ||
      (prevSerie?.stroke != null && prevSerie?.stroke !== nextSerie?.stroke) ||
      (nextSerie?.paths != null && prevSerie?.paths !== nextSerie?.paths) ||
      (nextSerie?.fill != null && prevSerie?.fill !== nextSerie?.fill) ||
      prevSerie?.points?.show !== nextSerie?.points?.show
    );
  });
  if (someSeriesHasChanged) return true;

  return false;
};
type ChartType = 'Line' | 'Scatter';

const UPlotChart: React.FC<Props> = ({
  allowDownload,
  data,
  isLoading,
  options,
  handleError,
  experimentId,
  xAxis,
}: Props) => {
  const chartRef = useRef<uPlot>();
  const { refObject, refCallback, size } = useResize();
  const classes = [css.base];

  const {
    themeSettings: { themeIsDark, theme },
  } = useTheme();

  const { options: syncOptions, syncService } = useChartSync();

  // line charts have their zoom state handled by `SyncProvider`, scatter charts do not.
  const chartType: ChartType = options?.mode === 2 ? 'Scatter' : 'Line';

  const hasData = data && data.length > 1 && (chartType === 'Scatter' || data?.[0]?.length);

  if (themeIsDark) classes.push(css.dark);

  useEffect(() => {
    if (data !== undefined && chartType === 'Line')
      syncService.updateDataBounds(data as AlignedData, xAxis);
  }, [syncService, chartType, data, xAxis]);

  const extendedOptions = useMemo(() => {
    const extended: Partial<uPlot.Options> = uPlot.assign(
      {
        width: size.width,
      },
      chartType === 'Line' ? syncOptions : {},
      options ?? {},
    );

    if (chartType === 'Line') {
      const activeBounds = syncService.activeBounds.get();
      if (activeBounds) {
        const { min, max } = activeBounds;
        const xScale = extended.scales?.x;
        if (xScale) {
          xScale.max = max;
          xScale.min = min;
        }
      }
    }

    // Override chart support colors to match theme.
    if (theme && extended.axes) {
      const borderColor = theme.surfaceBorderWeak;
      const labelColor = theme.surfaceOn;
      extended.axes = extended.axes.map((axis) => {
        return {
          ...axis,
          border: { stroke: borderColor },
          grid: { ...axis.grid, stroke: borderColor },
          stroke: labelColor,
          ticks: { ...axis.ticks, stroke: borderColor },
        };
      });
    }

    return extended as uPlot.Options;
  }, [options, theme, chartType, size.width, syncOptions, syncService]);

  const previousOptions = usePrevious(extendedOptions, undefined);

  useEffect(() => {
    return () => {
      chartRef?.current?.destroy();
      chartRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (!refObject.current) return;
    if (!hasData) {
      chartRef.current?.destroy();
      chartRef.current = undefined;
      return;
    }
    if (!chartRef.current || shouldRecreate(previousOptions, extendedOptions)) {
      chartRef.current?.destroy();
      chartRef.current = undefined;
      try {
        if (chartType === 'Scatter' || extendedOptions.series.length === data?.length) {
          chartRef.current = new uPlot(extendedOptions, data as AlignedData, refObject.current);
        }
      } catch (e) {
        chartRef.current?.destroy();
        chartRef.current = undefined;
        handleError?.(e, {
          level: ErrorLevel.Error,
          publicMessage: 'Unable to Load data for chart',
          publicSubject: 'Bad Data',
          silent: false,
          type: ErrorType.Ui,
        });
      }
    } else {
      try {
        chartRef.current?.setData(data as AlignedData, chartType === 'Scatter');
      } catch (e) {
        chartRef.current?.destroy();
        chartRef.current = undefined;
        handleError?.(e, {
          level: ErrorLevel.Error,
          publicMessage: 'Unable to Load data for chart',
          publicSubject: 'Bad Data',
          silent: false,
          type: ErrorType.Ui,
        });
      }
    }
  }, [data, hasData, extendedOptions, previousOptions, refObject, handleError, chartType]);

  useEffect(() => {
    extendedOptions.series.forEach((ser, i) => {
      const chartSer = chartRef.current?.series?.[i];
      if (chartSer && chartSer.show !== ser?.show)
        chartRef.current?.setSeries(i, { show: ser.show }, false);
    });
  }, [extendedOptions.series]);

  /**
   * Resize the chart when resize events happen.
   */
  useEffect(() => {
    if (!chartRef.current) return;
    const [width, height] = [size.width, options?.height || chartRef.current.height];
    if (chartRef.current.width === width && chartRef.current.height === height) return;
    chartRef.current.setSize({ height, width });
  }, [options?.height, refObject, size]);

  /*
   * Resync the chart when scroll events happen to correct the cursor position upon
   * a parent container scrolling.
   */
  useEffect(() => {
    const throttleFunc = throttle(SCROLL_THROTTLE_TIME, () => {
      if (chartRef.current) chartRef.current.syncRect();
    });
    const handleScroll = () => throttleFunc();

    /*
     * The true at the end is the important part,
     * it tells the browser to capture the event on dispatch,
     * even if that event does not normally bubble, like change, focus, and scroll.
     */
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('scroll', handleScroll);
      throttleFunc.cancel();
    };
  }, []);

  return (
    <div className={classes.join(' ')} ref={refCallback} style={{ minHeight: 250 }}>
      {allowDownload && <DownloadButton containerRef={refObject} experimentId={experimentId} />}
      {!hasData && !isLoading && (
        <div className={css.chartEmpty}>
          <span>No data to plot.</span>
        </div>
      )}
      {isLoading && <Spinner spinning tip="Loading chart data..." />}
    </div>
  );
};

export default UPlotChart;

const DownloadButton = ({
  containerRef,
  experimentId,
}: {
  containerRef: RefObject<HTMLElement>;
  experimentId?: number;
}) => {
  const downloadUrl = useRef<string>();
  const downloadNode = useRef<HTMLAnchorElement>(null);
  const fileName = useMemo(
    () => (experimentId ? `chart-trial-${experimentId}.png` : 'chart.png'),
    [experimentId],
  );

  useEffect(() => {
    return () => {
      if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current);
    };
  }, []);

  const handleDownloadClick = useCallback(() => {
    if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current);
    const canvas = containerRef.current?.querySelector('canvas');
    const url = canvas?.toDataURL('image/png');
    if (url && downloadNode.current) {
      downloadNode.current.href = url;
      downloadNode.current.click();
    }
    downloadUrl.current = url;
  }, [containerRef]);

  return (
    <>
      <div className={css.download}>
        <Button
          icon={<Icon name="download" showTooltip size="small" title="Download Chart" />}
          type="text"
          onClick={handleDownloadClick}
        />
      </div>
      {/* this is an invisible link used to programatically download the image file */}
      <a
        aria-disabled
        className={css.invisibleLink}
        download={fileName}
        href={downloadUrl.current}
        ref={downloadNode}
      />
    </>
  );
};
