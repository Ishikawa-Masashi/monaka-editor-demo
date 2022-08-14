import * as React from 'react';
import {
  useEffect,
  useState,
  useContext,
  CSSProperties,
  useRef,
  useMemo,
} from 'react';
import { EditorViewContext } from '../../contexts/EditorViewContext';
import {
  useFontInfo,
  useLayoutInfo,
  useMouseDownState,
  useOnClickInside,
  useRefEffect,
} from '../../hooks';
import { px } from '../../utilities';
import {
  EditorOption,
  IComputedEditorOptions,
} from '../../vs/editor/common/config/editorOptions';
import { WritingMode } from '../../config/writingMode';
import { HorizontalScrollbar } from '../horizontalScrollbar';
import { VerticalScrollbar } from '../verticalScrollbar';

import './EditorScrollbar.css';

type Props = {
  options: IComputedEditorOptions;
  children: React.ReactNode;
};

export const EditorScrollbar: React.FC<Props> = (props) => {
  const { children, options } = props;

  const {
    editor,
    writingMode,
    renderingContext: ctx,
  } = useContext(EditorViewContext);

  const { layoutInfo } = useLayoutInfo();
  const { fontInfo } = useFontInfo();

  const [left, setLeft] = useState<string>('unset');
  const [right, setRight] = useState(0);
  const [top, setTop] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const editorScrollableRef = useRef<HTMLDivElement>(null);

  // const _onScrollTimeout = useRef(()=>{

  // });
  useOnClickInside(editorScrollableRef, (evt) => {
    // evt.stopPropagation();
    evt.preventDefault();
    editor.focus();
  });

  // const [isReady, clear, set] = useTimeoutFn(() => {
  //   onScrollTimeout();
  // }, 0);

  // const onScrollTimeout = useCallback(() => {
  //   const rect = editorScrollableRef.current?.getBoundingClientRect();

  //   if (!rect) {
  //     return;
  //   }

  //   if (mouseDownState.leftButton) {
  //     const modelData = editor.getModelData();
  //     if (!modelData) {
  //       return;
  //     }
  //     const pos = editor.getPosition();
  //     if (!pos) {
  //       return;
  //     }
  //     const viewPosition =
  //       modelData.viewModel.coordinatesConverter.convertModelPositionToViewPosition(
  //         pos
  //       );
  //     if (mouseDownState.getPosition().y < rect.top) {
  //       modelData?.view.viewController.__moveToSelect(
  //         new Position(viewPosition.lineNumber - 1, viewPosition.column)
  //       );
  //     } else if (rect.bottom < mouseDownState.getPosition().y) {
  //       modelData?.view.viewController.__moveToSelect(
  //         new Position(viewPosition.lineNumber + 1, viewPosition.column)
  //       );
  //     }
  //   }

  //   if (mouseDownState.getPosition().y < rect.top) {
  //     set();
  //     return;
  //   }

  //   if (rect.bottom < mouseDownState.getPosition().y) {
  //     set();
  //     return;
  //   }
  // }, [mouseDownState, editor, set]);

  // const onMouseMove = useCallback(
  //   (evt: MouseEvent) => {
  //     if (!mouseDownState.leftButton) {
  //       return;
  //     }
  //     if (editorScrollableRef.current) {
  //       const rect = editorScrollableRef.current.getBoundingClientRect();
  //       if (!rect) {
  //         return;
  //       }

  //       if (mouseDownState.getPosition().y < rect.top) {
  //         set();
  //       }
  //       if (rect.bottom < mouseDownState.getPosition().y) {
  //         set();
  //       }
  //     }
  //   },
  //   [set, mouseDownState]
  // );

  useEffect(() => {
    // document.addEventListener('mousemove', onMouseMove);

    return () => {
      // document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const leftToRightHorizontalWriting = useMemo(
    () => writingMode === WritingMode.LeftToRightHorizontalWriting,
    [writingMode]
  );

  useEffect(() => {
    if (leftToRightHorizontalWriting) {
      setLeft(px(layoutInfo.contentLeft));
      setTop(0);
      const minimap = options.get(EditorOption.minimap);
      const side = minimap.side;
      if (side === 'right') {
        setWidth(layoutInfo.contentWidth + layoutInfo.minimap.minimapWidth);
      } else {
        setWidth(layoutInfo.contentWidth);
      }
      setHeight(layoutInfo.height);
      return;
    }

    if (writingMode === WritingMode.RightToLeftVerticalWriting) {
      setLeft('unset');
      setTop(layoutInfo.contentLeft);
      setRight(0);

      const minimap = options.get(EditorOption.minimap);
      const side = minimap.side;
      if (side === 'right') {
        setHeight(layoutInfo.contentWidth + layoutInfo.minimap.minimapWidth);
      } else {
        setHeight(layoutInfo.contentWidth);
      }
      setWidth(layoutInfo.height);
      return;
    }
  }, [layoutInfo, writingMode, leftToRightHorizontalWriting]);

  const horizontalScrollbarSize = useMemo(
    () =>
      leftToRightHorizontalWriting
        ? layoutInfo.horizontalScrollbarHeight
        : layoutInfo.verticalScrollbarWidth,
    []
  );

  const verticalScrollbarVisibleSize = useMemo(
    () =>
      leftToRightHorizontalWriting
        ? layoutInfo.height
        : layoutInfo.contentWidth - horizontalScrollbarSize,
    [leftToRightHorizontalWriting, layoutInfo]
  );

  const verticalScrollbarSize = useMemo(
    () =>
      leftToRightHorizontalWriting
        ? layoutInfo.verticalScrollbarWidth
        : layoutInfo.horizontalScrollbarHeight,
    [leftToRightHorizontalWriting, layoutInfo]
  );

  if (!options) {
    return <></>;
  }

  const style: CSSProperties = {
    top: `${top}px`,
    left,
    right: `${right}px`,
    width: `${width}px`,
    height: `${height}px`,
    fontFamily: fontInfo.fontFamily,
    letterSpacing: fontInfo.letterSpacing,
  };

  if (!ctx) {
    return <></>;
  }

  return (
    <div
      ref={editorScrollableRef}
      style={style}
      className={'editor-scrollable'}
    >
      {children}
      <VerticalScrollbar
        visibleSize={verticalScrollbarVisibleSize}
        scrollbarSize={verticalScrollbarSize}
        scrollSize={
          leftToRightHorizontalWriting ? ctx.scrollHeight : ctx.scrollWidth
        }
        scrollPosition={
          leftToRightHorizontalWriting ? ctx.scrollTop : ctx.scrollLeft
        }
        onScroll={(scroll) => {
          leftToRightHorizontalWriting
            ? editor.setScrollTop(scroll)
            : editor.setScrollLeft(scroll);
        }}
      />
      <HorizontalScrollbar
        isInverse={!leftToRightHorizontalWriting}
        scrollbarSize={
          leftToRightHorizontalWriting
            ? layoutInfo.horizontalScrollbarHeight
            : layoutInfo.verticalScrollbarWidth
        }
        visibleSize={
          leftToRightHorizontalWriting
            ? layoutInfo.contentWidth - layoutInfo.verticalScrollbarWidth
            : layoutInfo.height
        }
        scrollSize={
          leftToRightHorizontalWriting
            ? ctx.scrollWidth - layoutInfo.verticalScrollbarWidth
            : ctx.scrollHeight
        }
        scrollPosition={
          leftToRightHorizontalWriting ? ctx.scrollLeft : ctx.scrollTop
        }
        onScroll={(scroll) => {
          leftToRightHorizontalWriting
            ? editor.setScrollLeft(scroll)
            : editor.setScrollTop(scroll);
        }}
      />
    </div>
  );
};
