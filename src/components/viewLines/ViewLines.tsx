import * as React from 'react';
import { FunctionComponent, useMemo, CSSProperties } from 'react';

import { FontInfo } from '../../vs/editor/common/config/fontInfo';
import { ViewLine } from '../viewLine/ViewLine';
import { WritingMode, from } from '../../config/writingMode';
import { useContext } from 'react';
import { EditorViewContext } from '../../contexts/EditorViewContext';
import { useFontInfo } from '../../hooks';

import './ViewLines.css';

type Props = {
  // writingMode: WritingMode;
};

export const ViewLines: FunctionComponent<Props> = (props) => {
  const {
    renderingContext: ctx,
    editor,
    writingMode,
  } = useContext(EditorViewContext);

  const { fontInfo } = useFontInfo();

  const children = useMemo(() => {
    const result: JSX.Element[] = [];

    if (!ctx) {
      return result;
    }

    const { viewportData } = ctx;

    const { startLineNumber, endLineNumber, relativeVerticalOffset } =
      viewportData;

    for (
      let lineNumber = startLineNumber;
      lineNumber <= endLineNumber;
      ++lineNumber
    ) {
      const lineIndex = lineNumber - startLineNumber;
      result.push(
        <ViewLine
          key={lineNumber}
          viewLineNumber={lineNumber}
          viewLineRenderingData={viewportData.getViewLineRenderingData(
            lineNumber
          )}
          lineHeight={fontInfo.lineHeight}
          offset={relativeVerticalOffset[lineIndex]}
          writingMode={writingMode}
        />
      );
    }

    return result;
  }, [ctx, writingMode]);

  if (!ctx) {
    return <></>;
  }

  // const adjustedScrollTop = ctx.scrollTop - ctx.bigNumbersDelta;
  const height = Math.min(ctx.scrollHeight, 1000000);
  const width = ctx.scrollWidth;

  const style: CSSProperties = {
    // top: `${-adjustedScrollTop}px`,
    height: `${height}px`,
    width: `${width}px`,
    position: 'absolute',
  };

  return (
    <div
      data-writing-mode={from(writingMode).toString()}
      style={style}
      className={'view-lines'}
      id={`${editor.getId()}-view-lines`}
    >
      {children}
    </div>
  );
};
