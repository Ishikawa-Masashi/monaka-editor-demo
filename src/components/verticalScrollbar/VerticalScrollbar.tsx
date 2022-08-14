import * as React from 'react';
import { FunctionComponent, useEffect, useRef, useMemo } from 'react';
import { useConst } from '../../hooks';

import './VerticalScrollbar.css';

type Props = {
  visibleSize: number;
  scrollbarSize: number;
  scrollSize: number;
  scrollPosition: number;
  onScroll: (scroll: number) => void;
};

/**
 * The minimal size of the slider (such that it can still be clickable) -- it is artificially enlarged.
 */
const MINIMUM_SLIDER_SIZE = 20;

export const VerticalScrollbar: FunctionComponent<Props> = (props) => {
  const { visibleSize, scrollbarSize, scrollSize, scrollPosition, onScroll } =
    props;

  const scrollbarRef = useRef<HTMLDivElement>(null);

  const sliderSize = useMemo(() => {
    return Math.round(
      Math.max(
        MINIMUM_SLIDER_SIZE,
        Math.floor((visibleSize * visibleSize) / scrollSize)
      )
    );
  }, [scrollSize, visibleSize]);

  const availableSize = useMemo(() => {
    return visibleSize - sliderSize;
  }, [sliderSize, visibleSize]);

  const scrollbarStyle = useMemo(() => {
    return { width: `${scrollbarSize}px`, height: `${visibleSize}px` };
  }, [scrollbarSize, visibleSize]);

  const sliderStyle = useMemo(() => {
    const computedSliderRatio =
      (visibleSize - sliderSize) / (scrollSize - visibleSize);
    return {
      height: `${sliderSize}px`,
      top: `${scrollPosition * computedSliderRatio}px`,
    };
  }, [sliderSize, scrollPosition, visibleSize, scrollSize]);

  const onMouseDownAndMove = (
    evt: MouseEvent | React.MouseEvent<HTMLDivElement>
  ) => {
    evt.stopPropagation();

    if (!(evt.button === 0)) {
      return;
    }
    const { clientY } = evt;

    if (!scrollbarRef.current) {
      return;
    }
    const scrollbar = scrollbarRef.current;
    const dy = clientY - scrollbar.getBoundingClientRect().y - sliderSize / 2;

    const sliderOffsetTop = Math.min(Math.max(0, dy), visibleSize - sliderSize);

    const computedSliderRatio =
      (visibleSize - sliderSize) / (scrollSize - visibleSize);

    onScroll(sliderOffsetTop / computedSliderRatio);
  };

  const onMouseUp = (evt: MouseEvent) => {
    evt.stopPropagation();
    window.removeEventListener('mousemove', onMouseDownAndMove);
    window.removeEventListener('mousemove', onMouseUp);
  };

  return (
    <div
      className={'vertical-scrollbar'}
      style={scrollbarStyle}
      ref={scrollbarRef}
      onMouseDown={onMouseDownAndMove}
    >
      <div
        className={'slider'}
        style={sliderStyle}
        onMouseDown={(evt) => {
          evt.stopPropagation();

          window.addEventListener('mousemove', onMouseDownAndMove);
          window.addEventListener('mouseup', onMouseUp);
        }}
      ></div>
    </div>
  );
};
