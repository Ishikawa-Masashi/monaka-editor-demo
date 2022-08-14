import * as React from 'react';
import { useContext, FunctionComponent, useMemo, CSSProperties } from 'react';

import { useEditorViewContext } from '../../contexts/EditorViewContext';

import { ViewLineRenderingData } from '../../vs/editor/common/viewModel/viewModel';
import { WritingMode, from } from '../../config/writingMode';
import { IndentGuides } from '../indentGuides';
import { getLeftToRightHorizontalWritingViewColumn } from './common/getLeftToRightHorizontalWritingViewColumn';
import { getRightToLeftVerticalWritingViewColumn } from './common/getRightToLeftVerticalWritingViewColumn';

import { Selection } from '../..';
import { useFontInfo, useStyleKeys } from '../../hooks';

import './ViewLine.css';

type Props = {
  viewLineRenderingData: ViewLineRenderingData;
  lineHeight: number;
  offset: number;
  writingMode: WritingMode;
  viewLineNumber: number;
};

export const ViewLine: FunctionComponent<Props> = (props) => {
  const {
    viewLineRenderingData,
    lineHeight,
    offset,
    writingMode,
    viewLineNumber,
  } = props;

  const {
    editor,
    renderingContext: ctx,
    selectionStart,
    setSelectionStart,
    mouseDownState,
  } = useEditorViewContext();

  const { widthKey, heightKey, topKey } = useStyleKeys();

  const { fontInfo } = useFontInfo();

  const children = useMemo(() => {
    const result = [];
    const { tokens } = viewLineRenderingData;

    const content = viewLineRenderingData.content.replace(/\s/g, '\xa0');

    let startIndex = 0;
    for (
      let tokenIndex = 0, tokensLen = tokens.getCount();
      tokenIndex < tokensLen;
      tokenIndex++
    ) {
      const endIndex = tokens.getEndOffset(tokenIndex);
      const foreground = tokens.getForeground(tokenIndex);
      result.push(
        <span className={`mtk${foreground}`} key={tokenIndex}>
          {content.slice(startIndex, endIndex)}
        </span>
      );
      startIndex = endIndex;
    }
    return result;
  }, [viewLineRenderingData]);

  const getViewColumn = useMemo(() => {
    return writingMode === WritingMode.LeftToRightHorizontalWriting
      ? getLeftToRightHorizontalWritingViewColumn
      : getRightToLeftVerticalWritingViewColumn;
  }, [writingMode]);

  const style: CSSProperties = {
    [topKey]: `${offset}px`,
    [heightKey]: `${lineHeight}px`,
    [widthKey]: '100%',
    position: 'absolute',
  };

  const indents = useMemo(() => {
    return <IndentGuides viewLineNumber={viewLineNumber} />;
  }, [viewLineNumber]);

  // const decorations = useMemo(() => {
  //   const content = viewLineRenderingData.content.replace(/\s/g, '\xa0');
  //   return (
  //     <LineDecorations viewLineNumber={viewLineNumber} content={content} />
  //   );
  // }, [viewLineNumber, viewLineRenderingData]);

  return (
    <div
      id={`${editor.getId()}-view-line-number:${viewLineNumber}`}
      style={style}
      data-writing-mode={from(writingMode).toString()}
      onMouseDown={(evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        const { currentTarget, clientX, clientY } = evt;

        const viewColumn = getViewColumn(
          currentTarget.firstChild! as Element,
          writingMode === WritingMode.LeftToRightHorizontalWriting
            ? clientX
            : clientY,
          fontInfo.typicalHalfwidthCharacterWidth
        );

        const { viewportData } = ctx!;
        const modelPosition = viewportData.convertViewPositionToModelPosition(
          viewLineNumber,
          viewColumn
        );

        editor.setPosition(modelPosition);
        editor.pushUndoStop();
        editor.revealPosition(modelPosition);
        setSelectionStart(modelPosition);
      }}
      onMouseMove={(evt) => {
        const { currentTarget, clientX, clientY } = evt;
        evt.stopPropagation();
        // evt.preventDefault();

        if (mouseDownState.leftButton) {
          const viewColumn = getViewColumn(
            currentTarget.firstChild! as Element,
            writingMode === WritingMode.LeftToRightHorizontalWriting
              ? clientX
              : clientY,
            fontInfo.typicalHalfwidthCharacterWidth
          );

          const { viewportData } = ctx!;
          const modelPosition = viewportData.convertViewPositionToModelPosition(
            viewLineNumber,
            viewColumn
          );

          if (selectionStart) {
            // editor.setPosition(modelPosition);
            editor.setSelection(
              Selection.fromPositions(selectionStart, modelPosition)
            );
            // editor.setSelection(
            //   Range.fromPositions(selectionStart, modelPosition)
            // );
          }
        }
      }}
      onMouseEnter={(evt) => {
        // evt.stopPropagation();
        // evt.preventDefault();
        const { currentTarget, clientX, clientY } = evt;

        if (mouseDownState.leftButton) {
          const viewColumn = getViewColumn(
            currentTarget.firstChild! as Element,
            writingMode === WritingMode.LeftToRightHorizontalWriting
              ? clientX
              : clientY,
            fontInfo.typicalHalfwidthCharacterWidth
          );

          const { viewportData } = ctx!;
          const modelPosition = viewportData.convertViewPositionToModelPosition(
            viewLineNumber,
            viewColumn
          );

          if (selectionStart) {
            // editor.setPosition(modelPosition);
            editor.setSelection(
              Selection.fromPositions(selectionStart, modelPosition)
            );
            // editor.setSelection(
            //   Range.fromPositions(selectionStart, modelPosition)
            // );
          }
        }
      }}
    >
      <span style={{ position: 'absolute' }}>{children}</span>
      {indents}
      {/* {decorations} */}
    </div>
  );
};
