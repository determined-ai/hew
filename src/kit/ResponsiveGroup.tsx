import React, { Children, CSSProperties, useEffect, useRef, useState } from 'react';

import useResize from './internal/useResize';
import css from './ResponsiveGroup.module.scss';
import { ShirtSize } from './Theme';

interface Props {
  children?: React.ReactNode;
  gap?: ShirtSize;
  maxVisible?: number;
  onChange?: (numberVisible: number) => void;
}

const gapMap = {
  [ShirtSize.Small]: 4,
  [ShirtSize.Medium]: 8,
  [ShirtSize.Large]: 16,
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
  const [numVisible, setNumVisible] = useState<number>();
  const childrenArray = Children.toArray(children);
  const refs = useRef(childrenArray.map(() => React.createRef<HTMLDivElement>()));
  const { size, refCallback } = useResize();

  useEffect(() => {
    const maxVisibleChildren = Math.min(childrenArray.length, maxVisible);
    let accumulatedWidth = 0;
    let visible = 0;
    for (let i = 0; i < maxVisibleChildren; i++) {
      const el = refs.current[i]?.current;
      if (!el) continue;
      accumulatedWidth += getPotentialWidth(el);
      if (accumulatedWidth > size.width) {
        el.style.display = 'none';
      } else {
        el.style.display = 'initial';
        visible++;
      }
      if (i !== maxVisibleChildren - 1) accumulatedWidth += gapMap[gap];
    }
    setNumVisible(visible);
  }, [childrenArray.length, gap, maxVisible, size.width]);

  useEffect(() => {
    if (numVisible === undefined) return;
    onChange?.(numVisible);
  }, [numVisible, onChange]);

  return (
    <div
      className={css.base}
      ref={refCallback}
      style={{ '--max-visible': maxVisible, 'gap': gapMap[gap] } as CSSProperties}>
      {childrenArray.slice(0, maxVisible).map((child, idx) => (
        <div className={css.responsiveChild} key={idx} ref={refs.current[idx]}>
          {child}
        </div>
      ))}
    </div>
  );
};

export default ResponsiveGroup;
