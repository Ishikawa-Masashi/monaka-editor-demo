import * as React from 'react';
import { FunctionComponent, useEffect, useRef, useMemo } from 'react';
import { useConst } from '../../hooks';

import './HorizontalScrollbar.css';

type Props = {
  scrollbarSize: number;
  visibleSize: number;
  scrollSize: number;
  scrollPosition: number;
  onScroll: (scroll: number) => void;
  isInverse?: boolean;
};

/**
 * The minimal size of the slider (such that it can still be clickable) -- it is artificially enlarged.
 */
const MINIMUM_SLIDER_SIZE = 20;

export const HorizontalScrollbar: FunctionComponent<Props> = (props) => {
  const {
    scrollbarSize,
    visibleSize,
    scrollSize,
    scrollPosition,
    onScroll,
    isInverse = false,
  } = props;

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

  const computedSliderRatio = useMemo(() => {
    return availableSize / (scrollSize - visibleSize);
  }, [availableSize, scrollSize, visibleSize]);

  const scrollbarStyle = useMemo(() => {
    return {
      width: `${visibleSize}px`,
      height: `${scrollbarSize}px`,
      display: availableSize > 0 ? 'block' : 'none',
    };
  }, [visibleSize, scrollbarSize, availableSize]);

  const sliderStyle = useMemo(() => {
    return {
      width: `${sliderSize}px`,
      left: `${
        isInverse
          ? visibleSize - sliderSize - scrollPosition * computedSliderRatio
          : scrollPosition * computedSliderRatio
      }px`,
    };
  }, [sliderSize, scrollPosition, visibleSize, scrollSize, isInverse]);

  const onMouseDownAndMove = (
    evt: MouseEvent | React.MouseEvent<HTMLDivElement>
  ) => {
    evt.preventDefault();
    evt.stopPropagation();

    if (!(evt.button === 0)) {
      return;
    }

    const { clientX } = evt;

    if (!scrollbarRef.current) {
      return;
    }
    const scrollBar = scrollbarRef.current;

    const dx = clientX - scrollBar.getBoundingClientRect().x - sliderSize / 2;

    const sliderOffsetLeft = Math.min(
      Math.max(0, dx),
      visibleSize - sliderSize
    );

    onScroll(
      isInverse
        ? (visibleSize - sliderSize - sliderOffsetLeft) / computedSliderRatio
        : sliderOffsetLeft / computedSliderRatio
    );
  };

  const onMouseUp = (evt: MouseEvent) => {
    evt.stopPropagation();
    window.removeEventListener('mousemove', onMouseDownAndMove);
    window.removeEventListener('mousemove', onMouseUp);
  };

  return (
    <div
      className={'horizontal-scrollbar'}
      ref={scrollbarRef}
      style={scrollbarStyle}
      onMouseDown={onMouseDownAndMove}
    >
      <div
        className={'slider'}
        style={sliderStyle}
        onMouseDown={(evt) => {
          evt.stopPropagation();

          window.addEventListener('mousemove', onMouseDownAndMove);
          window.addEventListener('mouseup', onMouseUp);

          window.addEventListener('mouseup', () => {
            window.removeEventListener('mousemove', onMouseDownAndMove);
          });
        }}
      ></div>
    </div>
  );
};
