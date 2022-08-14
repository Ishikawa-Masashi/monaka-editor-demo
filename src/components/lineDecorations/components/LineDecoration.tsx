import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { FunctionComponent, useContext } from 'react';
import { useEditorViewContext } from '../../../contexts/EditorViewContext';
import { useStyleKeys } from '../../../hooks';

import { FoldingController } from '../../../vs/editor/contrib/folding/folding';
import { toggleCollapseState } from '../../../vs/editor/contrib/folding/foldingModel';

import './LineDecoration.scss';

type Props = {
  lineNumber: number;
  content: string;
  height: number;
  start: number;
  end: number;
  offset?: number;
  isWholeLine?: boolean;
  firstLineDecorationClassName: string;
};

export const LineDecoration: FunctionComponent<Props> = (props) => {
  const {
    lineNumber,
    height,
    content,
    start,
    end,
    offset = 0,
    isWholeLine = false,
    firstLineDecorationClassName,
  } = props;

  const { editor } = useEditorViewContext();

  const { heightKey, topKey } = useStyleKeys();

  const icon = useMemo(() => {
    if (firstLineDecorationClassName.includes('folding-collapsed')) {
      return (
        <span
          className="folding-collapsed"
          onMouseDown={(evt) => {
            if (!lineNumber) {
              return;
            }
            const foldingController = FoldingController.get(editor);
            const foldingModel = foldingController.getFoldingModel();
            if (foldingModel) {
              foldingModel.then((foldingModel) => {
                if (foldingModel) {
                  const selectedLines = [lineNumber];
                  toggleCollapseState(foldingModel, 1, selectedLines);
                }
              });
            }
          }}
        >
          ···
        </span>
      );
    }

    return <></>;
  }, [firstLineDecorationClassName, lineNumber]);

  const style = useMemo(() => {
    return {
      [heightKey]: `${height}px`,
      [topKey]: `${offset}px`,
    };
  }, [height, offset]);

  return (
    <div className={`line-decoration`} style={style}>
      <span style={{ color: 'transparent', pointerEvents: 'none' }}>
        {content.slice(0, start - 1)}
      </span>
      <span style={{ color: 'transparent', pointerEvents: 'none' }}>
        {content.slice(start - 1, end - 1)}
      </span>
      <span>{icon}</span>
    </div>
  );
};
