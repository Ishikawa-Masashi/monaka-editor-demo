import React from 'react';
import { useCallback, useRef, FunctionComponent, useEffect } from 'react';

import { useVirtual } from '@ishikawa_masashi/react-virtual';

import './HorizontalList.css';

type Props = {
  height: number;
  width: number;
  size: number;
  onRender: (index: number) => JSX.Element;
  offset: number;
  lineHeight: number;
  overscan?: number;
  paddingEnd?: number;
};

export const HorizontalList: FunctionComponent<Props> = (props) => {
  const {
    height,
    width,
    size,
    onRender,
    offset,
    lineHeight,
    overscan = 5,
    paddingEnd = 0,
  } = props;

  const parentRef = useRef<HTMLDivElement>(null);

  const columnVirtualizer = useVirtual({
    horizontal: true,
    size,
    parentRef,
    estimateSize: useCallback(() => lineHeight, [lineHeight]),
    overscan,
    paddingEnd,
  });

  return (
    <div
      ref={parentRef}
      className="horizontal-list"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div
        style={{
          width: `${columnVirtualizer.totalSize}px`,
          height: '100%',
          position: 'relative',
        }}
      >
        {columnVirtualizer.virtualItems.map((virtualColumn) => (
          <div
            key={virtualColumn.index}
            className={virtualColumn.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${virtualColumn.size}px`,
              transform: `translateX(${
                columnVirtualizer.totalSize - virtualColumn.start
              }px)`,
              // overflow: 'hidden',
            }}
          >
            {onRender(virtualColumn.index)}
          </div>
        ))}
      </div>
    </div>
  );
};
