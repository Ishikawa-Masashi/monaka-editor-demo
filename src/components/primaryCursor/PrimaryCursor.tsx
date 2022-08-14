import * as React from 'react';
import {
  useState,
  useEffect,
  useMemo,
  FunctionComponent,
  useContext,
  useRef,
  useCallback,
  CSSProperties,
} from 'react';
import { EditorViewContext } from '../../contexts/EditorViewContext';
import { EditorOption } from '../../vs/editor/common/config/editorOptions';
import { WritingMode } from '../../config/writingMode';
import { TextAreaInput } from '../textAreaInput';
import { useLayoutInfo, useStyleKeys } from '../../hooks';

import './PrimaryCursor.css';

type Props = {
  lineText: string;
  lineHeight: number;
  position: number;
  scroll: number;
};

export const PrimaryCursor: FunctionComponent<Props> = (props) => {
  const { lineHeight, lineText, position, scroll } = props;
  const {
    renderingContext: ctx,
    writingMode,
    editor,
    wordWrap,
  } = useContext(EditorViewContext);

  const { layoutInfo } = useLayoutInfo();

  const { heightKey, topKey } = useStyleKeys();

  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const margin = useMemo(() => {
    return (
      <div className={'primary-cursor'} style={{ color: 'transparent' }}>
        {lineText.slice(0, position - 1)}
      </div>
    );
  }, [lineText, position]);

  const revealPosition = useCallback(() => {
    const revealHorizontalRightPadding = editor.getOption(
      EditorOption.revealHorizontalRightPadding
    );
    const container = containerRef.current;
    if (container) {
      const containerSize =
        writingMode === WritingMode.LeftToRightHorizontalWriting
          ? container.clientWidth
          : container.clientHeight;

      const scrollLeft = editor.getScrollLeft();
      const cursorLeftPosition = containerSize - scrollLeft;

      // カーソルが左画面外に移動したとき
      if (cursorLeftPosition < scrollLeft) {
        editor.setScrollLeft(cursorLeftPosition);
        return;
      }

      // カーソルが右画面外に移動したとき
      const lienWidth = layoutInfo.contentWidth - revealHorizontalRightPadding;
      if (cursorLeftPosition > lienWidth) {
        editor.setScrollLeft(scrollLeft + (cursorLeftPosition - lienWidth));
      }
    }
  }, [editor, containerRef, layoutInfo, writingMode, lineHeight]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    if (writingMode === WritingMode.RightToLeftVerticalWriting) {
      setOffset(container.clientHeight);
      revealPosition();
      return;
    }

    setOffset(container.clientWidth);
    revealPosition();
  }, [margin]);

  const style: CSSProperties = useMemo(() => {
    return { [topKey]: `${scroll}px`, [heightKey]: `${lineHeight}px` };
  }, [writingMode, lineHeight, scroll]);

  return (
    <div
      ref={containerRef}
      id={'primary-cursor'}
      className={'primary-cursor-container '}
      style={style}
    >
      {margin}
      <TextAreaInput offset={offset} wordWrap={wordWrap !== 'off'} />
    </div>
  );
};
