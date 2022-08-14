import * as React from 'react';
import {
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  CSSProperties,
} from 'react';
import { DecorationsContext } from '../../contexts/DecorationsContext';
import { useEditorViewContext } from '../../contexts/EditorViewContext';
import { useFontInfo } from '../../hooks';
import { LineDecoration } from './components/LineDecoration';

import './LineDecorations.css';

type Props = {};

export const LineDecorations: FunctionComponent<Props> = (props) => {
  const { renderingContext: ctx } = useEditorViewContext();
  const { decorations } = useContext(DecorationsContext);
  const { fontInfo } = useFontInfo();

  const lineHeight = useMemo(() => {
    return fontInfo.lineHeight;
  }, [fontInfo]);

  const viewDecorations = useMemo(() => {
    if (!ctx) {
      return <></>;
    }

    const result = [];

    let key = 0;
    for (const decoration of decorations) {
      // if (decoration.options.isWholeLine) {
      //   continue;
      // }
      const startPosition = decoration.range.getStartPosition();
      const endPosition = decoration.range.getEndPosition();

      const { viewportData } = ctx;

      // const viewStartPosition = viewportData.convertModelPositionToViewPosition(
      //   startPosition.lineNumber,
      //   startPosition.column
      // );

      // const viewEndPosition = viewportData.convertModelPositionToViewPosition(
      //   endPosition.lineNumber,
      //   endPosition.column
      // );

      const viewStartPosition = startPosition;

      const viewEndPosition = endPosition;

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

      for (
        let lineNumber = startLineNumber;
        lineNumber <= endLineNumber;
        ++lineNumber
      ) {
        const lineIndex = lineNumber - viewportStartLineNumber;

        // const modelPosition =
        //   viewportData.convertViewPositionToModelPosition(lineNumber);
        // const modelLineNumber =
        //   modelPosition.column !== 1 ? undefined : modelPosition.lineNumber;

        const viewLineRenderingData =
          viewportData.getViewLineRenderingData(lineNumber);
        if (lineNumber === startLineNumber && lineNumber === endLineNumber) {
          const content = viewLineRenderingData.content.replace(/\s/g, '\xa0');
          result.push(
            <LineDecoration
              lineNumber={lineNumber}
              key={key++}
              content={content}
              height={lineHeight}
              start={startColumn}
              end={endColumn}
              offset={relativeVerticalOffset[lineIndex]}
              firstLineDecorationClassName={
                decoration.options.firstLineDecorationClassName || ''
              }
            />
          );
          break;
        }
        if (lineNumber === startLineNumber) {
          const content = viewLineRenderingData.content.replace(/\s/g, '\xa0');
          result.push(
            <LineDecoration
              lineNumber={lineNumber}
              key={key++}
              content={content}
              height={lineHeight}
              start={startColumn}
              end={content.length}
              offset={relativeVerticalOffset[lineIndex]}
              firstLineDecorationClassName={
                decoration.options.firstLineDecorationClassName || ''
              }
            />
          );
        }

        if (startLineNumber < lineNumber && lineNumber < endLineNumber) {
          const content = viewLineRenderingData.content.replace(/\s/g, '\xa0');
          result.push(
            <LineDecoration
              lineNumber={lineNumber}
              key={key++}
              content={content}
              height={lineHeight}
              start={1}
              end={content.length}
              offset={relativeVerticalOffset[lineIndex]}
              firstLineDecorationClassName={
                decoration.options.firstLineDecorationClassName || ''
              }
            />
          );
        }

        if (lineNumber === endLineNumber) {
          const content = viewLineRenderingData.content.replace(/\s/g, '\xa0');
          result.push(
            <LineDecoration
              lineNumber={lineNumber}
              key={key++}
              content={content}
              height={lineHeight}
              start={1}
              end={endColumn}
              offset={relativeVerticalOffset[lineIndex]}
              firstLineDecorationClassName={
                decoration.options.firstLineDecorationClassName || ''
              }
            />
          );
        }
      }
    }

    return result;
  }, [decorations, ctx, lineHeight]);

  if (!ctx) {
    return <></>;
  }

  const height = Math.min(ctx.scrollHeight, 1000000);
  const width = ctx.scrollWidth;

  const style: CSSProperties = {
    height: `${height}px`,
    width: `${width}px`,
  };

  return (
    <div style={style} className={'line-decorations'}>
      {viewDecorations}
    </div>
  );
};
