import * as React from 'react';
import { useEditorViewContext } from '../../contexts/EditorViewContext';
import { WritingMode } from '../../config/writingMode';
import { Selection } from '../..';

import './LinesContent.css';

type Props = {
  children: React.ReactNode;
};

export const LinesContent: React.FC<Props> = (props) => {
  const { children } = props;
  const {
    renderingContext: ctx,
    writingMode,
    editor,
    selectionStart,
  } = useEditorViewContext();

  if (!ctx) {
    return <></>;
  }

  const adjustedScrollTop = ctx.scrollTop - ctx.bigNumbersDelta;
  const height = Math.min(ctx.scrollHeight, 1000000);
  const width = ctx.scrollWidth;
  const left = ctx.scrollLeft;

  const style =
    writingMode === WritingMode.LeftToRightHorizontalWriting
      ? { top: `${-adjustedScrollTop}px`, left: `${-left}px` }
      : { right: `${-adjustedScrollTop}px`, top: `${-left}px` };

  return (
    <div
      className={'lines-content'}
      style={style}
      onMouseDown={() => {
        const model = editor.getModel();
        if (model) {
          const lineNumber = model.getLineCount()!;
          const column = model.getLineContent(lineNumber).length! + 1;
          editor.setPosition({ lineNumber, column });
        }
      }}
      onMouseMove={() => {
        if (selectionStart) {
          // console.log('mousemove');
          const model = editor.getModel();
          if (model) {
            const lineNumber = model.getLineCount()!;
            const column = model.getLineContent(lineNumber).length! + 1;
            // editor.setPosition({ lineNumber, column });
            editor.setSelection(
              Selection.fromPositions(selectionStart, { lineNumber, column })
            );
          }
        }
      }}
    >
      {children}
    </div>
  );
};
