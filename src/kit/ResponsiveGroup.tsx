import React, { Children, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import useResize from 'kit/internal/useResize';
import { ShirtSize, Spacing } from 'kit/Theme';

import css from './ResponsiveGroup.module.scss';

interface Props {
  children?: React.ReactNode;
  gap?: ShirtSize;
  maxVisible?: number;
  onChange?: (numberVisible: number) => void;
}

const gapMap = {
  [ShirtSize.Small]: Spacing.Xs,
  [ShirtSize.Medium]: Spacing.Md,
  [ShirtSize.Large]: Spacing.Xl,
} as const;

function getPotentialWidth(el: HTMLElement | null) {
  if (!el) return 0;
  el.style.display = 'initial';
  const width = el.clientWidth;
  el.style.display = '';
  return width;
}

const ResponsiveGroup: React.FC<Props> = ({
  children,
  gap = ShirtSize.Medium,
  maxVisible = 3,
  onChange,
}: Props) => {
  const [numVisible, setNumVisible] = useState<number>(0);
  const childrenArray = useMemo(() => Children.toArray(children), [children]);
  const refs = useRef(new Array<HTMLDivElement | null>(childrenArray.length));
  const { size, refCallback } = useResize();

  useLayoutEffect(() => {
    const { visible } = refs.current.reduce(
      (obj, el, i, arr) => {
        const newObj = structuredClone(obj);
        newObj.accumulatedWidth += getPotentialWidth(el);
        if (newObj.accumulatedWidth > size.width) {
          if (el) el.style.display = 'none';
        } else {
          if (el) {
            el.style.display = 'initial';
            newObj.visible++;
          }
        }
        if (i !== arr.length - 1) newObj.accumulatedWidth += gapMap[gap];
        return newObj;
      },
      { accumulatedWidth: 0, visible: 0 },
    );

    setNumVisible(visible);
  }, [childrenArray, gap, maxVisible, onChange, size.width]);

  useEffect(() => {
    onChange?.(numVisible);
  }, [onChange, numVisible]);

  return (
    <div className={css.base} ref={refCallback} style={{ gap: gapMap[gap] }}>
      {childrenArray.slice(0, maxVisible).map((child, idx) => (
        <div
          className={css.responsiveChild}
          key={idx}
          ref={(el) => {
            refs.current[idx] = el;
          }}>
          {child}
        </div>
      ))}
    </div>
  );
};

export default ResponsiveGroup;
