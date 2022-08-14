import * as React from 'react';
import {
  FunctionComponent,
  useContext,
  useEffect,
  CSSProperties,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';

import { EditorViewContext } from '../../contexts/EditorViewContext';
import { IViewModel } from '../../vs/editor/common/viewModel/viewModel';
import { HorizontalList } from '../horizontalList';
import { VerticalList } from '../verticalList';
import { MinimapLine } from './components/MinimapLine';

import { useFontInfo, useLayoutInfo, useStyleKeys } from '../../hooks';

import './Minimap.css';

type Props = {};

export const Minimap: FunctionComponent<Props> = () => {
  const {
    renderingContext: ctx,
    leftToRightHorizontalWriting,
    editor,
  } = useContext(EditorViewContext);

  const { widthKey, heightKey, topKey, leftKey } = useStyleKeys();

  const minimapContainerRef = useRef<HTMLDivElement>(null);

  const { layoutInfo } = useLayoutInfo();
  const { fontInfo } = useFontInfo();

  const [minimapLeft, setMinimapLeft] = useState(0);
  const [width, setWidth] = useState(0);
  const [minimapHeight, setMinimapHeight] = useState(0);
  const [scale, setScale] = useState(0);
  const [viewModel, setViewModel] = useState<IViewModel | null>(null);
  const [lineCount, setLineCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [minimapLineHeight, setMinimapLineHeight] = useState(0);

  useEffect(() => {
    const { minimapLeft, minimapCanvasInnerHeight } = layoutInfo.minimap;
    setMinimapLeft(minimapLeft);
    setWidth(layoutInfo.minimap.minimapWidth);
    setMinimapHeight(minimapCanvasInnerHeight);
    setScale(layoutInfo.minimap.minimapScale);
    setMinimapLineHeight(layoutInfo.minimap.minimapLineHeight);
  }, [layoutInfo]);

  const renderMinimap = useMemo(() => {
    return layoutInfo.minimap.renderMinimap;
  }, [layoutInfo]);

  const onRender = useCallback(
    (index: number) => {
      if (!viewModel) {
        return <div></div>;
      }
      return (
        <MinimapLine
          viewLineData={viewModel.getViewLineData(index + 1)}
          leftToRightHorizontalWriting={leftToRightHorizontalWriting}
        />
      );
    },
    [viewModel, leftToRightHorizontalWriting]
  );

  useEffect(() => {
    if (!ctx) {
      return;
    }

    const expectedViewportLineCount = ctx.viewportHeight / fontInfo.lineHeight;
    const extraLinesAtTheBottom = expectedViewportLineCount - 1;

    const minimapInnerHeight =
      minimapLineHeight * (lineCount + extraLinesAtTheBottom);

    const availableSize =
      minimapInnerHeight <= minimapHeight ? minimapInnerHeight : minimapHeight;
    const scrollMax =
      ctx.scrollHeight - (ctx.viewportHeight - fontInfo.lineHeight);
    const viewportScrollRatio = ctx.scrollTop / scrollMax;
    const sliderTop = viewportScrollRatio * (availableSize - sliderSize);

    setOffset(
      (ctx.scrollTop / ctx.scrollHeight) * minimapInnerHeight - sliderTop
    );
  }, [ctx, fontInfo, lineCount, minimapLineHeight]);

  useEffect(() => {
    if (!ctx) {
      return;
    }
    const viewModel = ctx.viewportData.getViewModel();

    setViewModel(viewModel);
    setLineCount(viewModel.getLineCount());
  }, [ctx]);

  const containerStyle = useMemo(() => {
    return {
      [leftKey]: `${minimapLeft}px`,
      [widthKey]: `${width}px`,
      [heightKey]: `${minimapHeight}px`,
    };
  }, [minimapHeight, minimapLeft, width, leftKey, widthKey, heightKey]);

  const sliderSize = useMemo(() => {
    if (!ctx) {
      return 0;
    }

    const expectedViewportLineCount = ctx.viewportHeight / fontInfo.lineHeight;
    // const extraLinesAtTheBottom = expectedViewportLineCount - 1;

    const sliderSize = minimapLineHeight * expectedViewportLineCount;
    return sliderSize;
  }, [ctx, fontInfo, minimapLineHeight]);

  const sliderStyle = useMemo(() => {
    if (!ctx) {
      return {};
    }

    // 最大スクロール量 = 最大スクロール高さ - ビューポートの高さ - 一行分の高さ
    // 注意 :
    //  最大スクロール高さは最後の余白部分も含む
    //  最後の余白部分は最後の一行だけ含むので、最後にビューポートの高さから一行分を引き算する
    const scrollMax =
      ctx.scrollHeight - (ctx.viewportHeight - fontInfo.lineHeight);

    const expectedViewportLineCount = ctx.viewportHeight / fontInfo.lineHeight;
    const extraLinesAtTheBottom = expectedViewportLineCount - 1;

    const viewportScrollRatio = ctx.scrollTop / scrollMax;

    const minimapInnerHeight =
      minimapLineHeight * (lineCount + extraLinesAtTheBottom);

    const availableSize =
      minimapInnerHeight <= minimapHeight ? minimapInnerHeight : minimapHeight;

    const sliderTop = viewportScrollRatio * (availableSize - sliderSize);
    return {
      [heightKey]: `${sliderSize}px`,
      [topKey]: `${sliderTop}px`,
    };
  }, [
    ctx,
    fontInfo,
    lineCount,
    minimapHeight,
    minimapLineHeight,
    heightKey,
    topKey,
    sliderSize,
  ]);

  const paddingEnd = useMemo(() => {
    if (!ctx) {
      return 0;
    }
    const expectedViewportLineCount = ctx.viewportHeight / fontInfo.lineHeight;
    const extraLinesAtTheBottom = expectedViewportLineCount - 1;
    return minimapLineHeight * extraLinesAtTheBottom;
  }, [ctx, minimapLineHeight, fontInfo]);

  const onMouseDownAndMove = (
    evt: MouseEvent | React.MouseEvent<HTMLDivElement>
  ) => {
    evt.stopPropagation();

    if (!ctx) {
      return;
    }

    if (!(evt.button === 0)) {
      return;
    }

    const { clientY, clientX } = evt;

    // const dy = clientY - mouseState.y;
    if (!minimapContainerRef.current) {
      return;
    }
    const minimapContainer = minimapContainerRef.current;
    const clientRect = minimapContainer.getBoundingClientRect();
    const dy = leftToRightHorizontalWriting
      ? clientY - clientRect.y
      : clientRect.x + clientRect.width - clientX;

    const scrollMax =
      ctx.scrollHeight - (ctx.viewportHeight - fontInfo.lineHeight);

    const expectedViewportLineCount = ctx.viewportHeight / fontInfo.lineHeight;
    const extraLinesAtTheBottom = expectedViewportLineCount - 1;

    const minimapInnerHeight =
      minimapLineHeight * (lineCount + extraLinesAtTheBottom);

    const availableSize =
      (minimapInnerHeight <= minimapHeight
        ? minimapInnerHeight
        : minimapHeight) - sliderSize;

    const sliderOffsetTop = Math.min(
      Math.max(0, dy - sliderSize / 2),
      availableSize
    );

    const scroll = (sliderOffsetTop / availableSize) * scrollMax;

    editor.setScrollTop(scroll);
  };

  const onMouseUp = (evt: MouseEvent) => {
    evt.stopPropagation();
    window.removeEventListener('mousemove', onMouseDownAndMove);
    window.removeEventListener('mousemove', onMouseUp);
  };

  if (renderMinimap === 0) {
    return <></>;
  }

  return (
    <div
      style={containerStyle}
      className={'minimap-container'}
      ref={minimapContainerRef}
      onMouseDown={onMouseDownAndMove}
    >
      <div className={'minimap-shadow-visible'}></div>
      <div className={'minimap'}>
        <div
          style={sliderStyle}
          className={'minimap-slider'}
          onMouseDown={(evt) => {
            evt.stopPropagation();

            window.addEventListener('mousemove', onMouseDownAndMove);
            window.addEventListener('mouseup', onMouseUp);
          }}
        ></div>
        {leftToRightHorizontalWriting ? (
          <VerticalList
            height={minimapHeight}
            width={width}
            size={lineCount}
            offset={offset}
            lineHeight={minimapLineHeight}
            onRender={onRender}
            paddingEnd={paddingEnd}
          />
        ) : (
          <HorizontalList
            height={width}
            width={minimapHeight}
            size={lineCount}
            offset={offset}
            lineHeight={minimapLineHeight}
            onRender={onRender}
            paddingEnd={paddingEnd}
          />
        )}
      </div>
    </div>
  );
};
