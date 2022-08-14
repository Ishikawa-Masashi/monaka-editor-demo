import * as React from 'react';
import { FunctionComponent, useMemo, CSSProperties, useEffect } from 'react';

import { FontInfo } from '../../vs/editor/common/config/fontInfo';
import { ViewLine } from '../viewLine/ViewLine';
import { useContext } from 'react';
import { EditorViewContext } from '../../contexts/EditorViewContext';

import './ViewCursors.css';
import { PrimaryCursor } from '../primaryCursor';
import { useCursorPositions, useFontInfo } from '../../hooks';

type Props = {};

export const ViewCursors: FunctionComponent<Props> = (props) => {
  const {
    editor,
    renderingContext: ctx,

    selection,
    selectionStart,
    setSelectionStart,
  } = useContext(EditorViewContext);

  const { primaryPosition } = useCursorPositions();
  const { fontInfo } = useFontInfo();

  const content = useMemo(() => {
    if (!ctx) {
      return '';
    }

    if (!primaryPosition) {
      return '';
    }

    const { viewportData } = ctx;
    const viewLineRenderingData = viewportData.getViewLineRenderingData(
      primaryPosition.lineNumber
    );
    return viewLineRenderingData.content.replace(/\s/g, '\xa0');
  }, [ctx, primaryPosition]);

  const scroll = useMemo(() => {
    if (!ctx) {
      return 0;
    }

    if (!primaryPosition) {
      return 0;
    }

    const { viewportData } = ctx;

    const { startLineNumber, endLineNumber, relativeVerticalOffset } =
      viewportData;

    const lineIndex = primaryPosition.lineNumber - startLineNumber;

    return relativeVerticalOffset[lineIndex];
  }, [ctx, primaryPosition]);

  return (
    <div className={'view-cursors'}>
      {primaryPosition && (
        <PrimaryCursor
          scroll={scroll}
          position={primaryPosition.column}
          lineText={content}
          lineHeight={fontInfo.lineHeight}
        />
      )}
    </div>
  );
};
