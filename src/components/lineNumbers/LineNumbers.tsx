import * as React from 'react';
import { useContext, useMemo, CSSProperties, FunctionComponent } from 'react';
import { EditorViewContext } from '../../contexts/EditorViewContext';
import { px } from '../../utilities';
import { WritingMode } from '../../config/writingMode';
import { LineNumber } from './components/LineNumber';

import './LineNumbers.css';
import { useLayoutInfo } from '../../hooks';

// type LineNumberProps = {
//   lineNumber?: number;
//   top: string;
//   decorations: ViewModelDecoration[];
//   right: string;
//   width: number;
// };

// function LineNumber(props: LineNumberProps) {
//   const { top, lineNumber, right, width } = props;

//   const style: CSSProperties = {
//     position: 'absolute',
//     top,
//     right,
//     width: px(width),
//     textAlign: 'right',
//   };
//   return <div style={style}>{lineNumber}</div>;
// }

type LineNumbersProps = {
  // renderingContext: RenderingContext;
};

export const LineNumbers: FunctionComponent<LineNumbersProps> = (props) => {
  const { renderingContext: ctx, writingMode } = useContext(EditorViewContext);
  const { layoutInfo } = useLayoutInfo();

  const lineNumbersWidth = useMemo(() => {
    return layoutInfo.lineNumbersWidth;
  }, [layoutInfo]);

  const decorationsWidth = useMemo(() => {
    return layoutInfo.decorationsWidth;
  }, [layoutInfo]);

  const result = useMemo(() => {
    const lineNumbers: JSX.Element[] = [];

    if (!ctx) {
      return [];
    }

    const { viewportData } = ctx;
    const { startLineNumber, endLineNumber, relativeVerticalOffset } =
      viewportData;

    const decorations = ctx.getDecorationsInViewport();

    for (
      let lineNumber = startLineNumber;
      lineNumber <= endLineNumber;
      ++lineNumber
    ) {
      // const lineIndex = lineNumber - visibleStartLineNumber;
      const lineIndex = lineNumber - startLineNumber;

      const modelPosition =
        viewportData.convertViewPositionToModelPosition(lineNumber);
      const modelLineNumber =
        modelPosition.column !== 1 ? undefined : modelPosition.lineNumber;

      const lineNumberDecorations = decorations.filter(
        (value) =>
          value.options.isWholeLine &&
          value.range.startLineNumber === lineNumber
      );

      lineNumbers.push(
        <LineNumber
          key={lineNumber}
          lineNumber={modelLineNumber}
          width={lineNumbersWidth}
          top={
            writingMode === WritingMode.LeftToRightHorizontalWriting
              ? px(relativeVerticalOffset[lineIndex])
              : 'unset '
          }
          right={
            writingMode === WritingMode.RightToLeftVerticalWriting
              ? px(relativeVerticalOffset[lineIndex])
              : 'unset '
          }
          decorations={lineNumberDecorations}
          decorationsWidth={decorationsWidth}
        />
      );
    }

    return lineNumbers;
  }, [ctx]);

  return <>{result}</>;
};
