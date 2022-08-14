import * as React from 'react';
import { useEditorViewContext } from '../contexts/EditorViewContext';

export type WidthKey = 'width' | 'height';
export type HeightKey = 'width' | 'height';
export type TopKey = 'top' | 'right';
export type LeftKey = 'left' | 'top';

export function useStyleKeys() {
  const { leftToRightHorizontalWriting, rightToLeftVerticalWriting } =
    useEditorViewContext();

  const widthKey = React.useMemo(
    (): WidthKey => (leftToRightHorizontalWriting ? 'width' : 'height'),
    [leftToRightHorizontalWriting]
  );

  const heightKey = React.useMemo(
    (): HeightKey => (leftToRightHorizontalWriting ? 'height' : 'width'),
    [leftToRightHorizontalWriting]
  );

  const topKey = React.useMemo(
    (): TopKey => (leftToRightHorizontalWriting ? 'top' : 'right'),
    [leftToRightHorizontalWriting]
  );

  const leftKey = React.useMemo(
    (): LeftKey => (leftToRightHorizontalWriting ? 'left' : 'top'),
    [leftToRightHorizontalWriting]
  );

  return {
    widthKey,
    heightKey,
    topKey,
    leftKey,
  };
}
