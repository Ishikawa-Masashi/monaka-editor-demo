import * as React from 'react';
import { useEditorViewContext } from '../contexts/EditorViewContext';
import { Position } from '../vs/editor/common/core/position';

export function useCursorPositions() {
  const { editor, renderingContext: ctx } = useEditorViewContext();

  const [primaryPosition, setPrimaryPosition] = React.useState<
    Position | undefined
  >();

  const [secondaryPositions, setSecondaryPositions] = React.useState<
    Position[]
  >([]);

  React.useEffect(() => {
    editor.onDidChangeCursorPosition((evt) => {
      if (!ctx) {
        return;
      }

      const { viewportData } = ctx;
      const { position, secondaryPositions } = evt;

      const viewPositon = viewportData.convertModelPositionToViewPosition(
        position.lineNumber,
        position.column
      );

      setPrimaryPosition(viewPositon);

      const viewPositons = secondaryPositions.map((secondaryPosition) =>
        viewportData.convertModelPositionToViewPosition(
          secondaryPosition.lineNumber,
          secondaryPosition.column
        )
      );

      setSecondaryPositions(viewPositons);
    });
  }, [editor, ctx]);

  return { primaryPosition, secondaryPositions };
}
