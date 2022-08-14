import React from 'react';
import { useCallback, useRef, FunctionComponent } from 'react';

import { useVirtual } from '@ishikawa_masashi/react-virtual';
import { useEffect } from 'react';

import './VerticalList.css';

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

export const VerticalList: FunctionComponent<Props> = (props) => {
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

  const rowVirtualizer = useVirtual({
    size,
    parentRef,
    estimateSize: useCallback(() => lineHeight, [lineHeight]),
    overscan,
    paddingEnd,
  });

  useEffect(() => {
    rowVirtualizer.scrollToOffset(offset);
  }, [offset, rowVirtualizer]);

  // console.log(`size:${size}`);
  // console.log(`totalSize:${rowVirtualizer.totalSize}`);
  // console.log(`offset:${offset}`);
  return (
    <div
      ref={parentRef}
      className="vertical-list-container"
      style={{
        height: `${height}px`,
        width: `${width}px`,
      }}
    >
      <div
        className="vertical-list"
        style={{
          height: `${rowVirtualizer.totalSize}px`,
        }}
      >
        {rowVirtualizer.virtualItems.map((virtualRow) => (
          <div
            key={virtualRow.index}
            className={virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
              // overflow: 'hidden',
            }}
          >
            {onRender(virtualRow.index)}
          </div>
        ))}
      </div>
    </div>
  );
};
