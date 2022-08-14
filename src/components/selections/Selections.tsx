import * as React from 'react';
import { FunctionComponent, useMemo, useContext, CSSProperties } from 'react';
import { EditorViewContext } from '../../contexts/EditorViewContext';
import { useFontInfo } from '../../hooks';
import { ViewSelection } from '../viewSelection';

import './Selections.css';

type P = {};

const Selection: FunctionComponent<P> = () => {
  return <></>;
};

type Props = {};

export const Selections: FunctionComponent<Props> = (props) => {
  const { renderingContext: ctx, selection } = useContext(EditorViewContext);
  const { fontInfo } = useFontInfo();

  const lineHeight = useMemo(() => {
    return fontInfo.lineHeight;
  }, [fontInfo]);

  const viewSelection = useMemo(() => {
    if (!selection) {
      return <></>;
    }

    if (selection.isEmpty()) {
      return <></>;
    }

    if (!ctx) {
      return <></>;
    }

    const startPosition = selection.getStartPosition();
    const endPosition = selection.getEndPosition();

    const viewStartPosition =
      ctx.viewportData.convertModelPositionToViewPosition(
        startPosition.lineNumber,
        startPosition.column
      );

    const viewEndPosition = ctx.viewportData.convertModelPositionToViewPosition(
      endPosition.lineNumber,
      endPosition.column
    );

    const { viewportData } = ctx;

    const {
      startLineNumber: viewportStartLineNumber,
      endLineNumber: viewportEndLineNumber,
      relativeVerticalOffset,
    } = viewportData;

    const startLineNumber = Math.max(
      viewStartPosition.lineNumber,
      viewportStartLineNumber
    );
    const startColumn = viewStartPosition.column;

    const endLineNumber = Math.min(
      viewEndPosition.lineNumber,
      viewportEndLineNumber
    );
    const endColumn = viewEndPosition.column;

    const result = [];
    let key = 0;
    for (
      let lineNumber = startLineNumber;
      lineNumber <= endLineNumber;
      ++lineNumber
    ) {
      const lineIndex = lineNumber - viewportStartLineNumber;
      const viewLineRenderingData =
        viewportData.getViewLineRenderingData(lineNumber);
      if (lineNumber === startLineNumber && lineNumber === endLineNumber) {
        const content = viewLineRenderingData.content.replace(/\s/g, '\xa0');
        return (
          <ViewSelection
            content={content}
            height={lineHeight}
            start={startColumn}
            end={endColumn}
            offset={relativeVerticalOffset[lineIndex]}
          />
        );
      }
      if (lineNumber === startLineNumber) {
        const content = viewLineRenderingData.content.replace(/\s/g, '\xa0');
        result.push(
          <ViewSelection
            key={key++}
            content={content}
            height={lineHeight}
            start={startColumn}
            end={content.length + 1}
            offset={relativeVerticalOffset[lineIndex]}
          />
        );
      }

      if (startLineNumber < lineNumber && lineNumber < endLineNumber) {
        const content = viewLineRenderingData.content.replace(/\s/g, '\xa0');
        result.push(
          <ViewSelection
            key={key++}
            content={content}
            height={lineHeight}
            start={1}
            end={content.length + 1}
            offset={relativeVerticalOffset[lineIndex]}
          />
        );
      }

      if (lineNumber === endLineNumber) {
        const content = viewLineRenderingData.content.replace(/\s/g, '\xa0');
        result.push(
          <ViewSelection
            key={key++}
            content={content}
            height={lineHeight}
            start={1}
            end={endColumn}
            offset={relativeVerticalOffset[lineIndex]}
          />
        );
      }
    }

    return result;
  }, [selection, ctx, lineHeight]);

  if (!ctx) {
    return <></>;
  }

  const height = Math.min(ctx.scrollHeight, 1000000);
  const width = ctx.scrollWidth;

  const style: CSSProperties = {
    height: `${height}px`,
    width: `${width}px`,
    position: 'absolute',
  };

  return <div style={style}>{viewSelection}</div>;
};
