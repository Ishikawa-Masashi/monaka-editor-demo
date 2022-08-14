import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { FunctionComponent, useContext } from 'react';
import { EditorViewContext } from '../../contexts/EditorViewContext';
import { useStyleKeys } from '../../hooks';

import './ViewSelection.css';

type Props = {
  content: string;
  height: number;
  start: number;
  end: number;
  offset?: number;
};

export const ViewSelection: FunctionComponent<Props> = (props) => {
  const { height, content, start, end, offset = 0 } = props;

  const {
    writingMode,
    editor,
    leftToRightHorizontalWriting,
    rightToLeftVerticalWriting,
  } = useContext(EditorViewContext);

  const { widthKey, heightKey } = useStyleKeys();

  const style = useMemo(() => {
    if (rightToLeftVerticalWriting) {
      return {
        width: `${height}px`,
        right: `${offset}px`,
      };
    }
    return {
      height: `${height}px`,
      top: `${offset}px`,
    };
  }, [height, offset, rightToLeftVerticalWriting]);

  return (
    <div className={'view-selection'} style={style}>
      <span style={{ color: 'transparent' }}>
        {content.slice(0, start - 1)}
      </span>
      <span className={'selected-text'}>
        {content.slice(start - 1, end - 1)}
      </span>
    </div>
  );
};
