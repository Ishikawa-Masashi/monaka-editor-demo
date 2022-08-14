import * as React from 'react';
import { useContext, useMemo, CSSProperties, FunctionComponent } from 'react';
import { EditorViewContext } from '../../../contexts/EditorViewContext';
import { px } from '../../../utilities';
import { ViewModelDecoration } from '../../../vs/editor/common/viewModel/viewModel';
import { FoldingController } from '../../../vs/editor/contrib/folding/folding';
import { toggleCollapseState } from '../../../vs/editor/contrib/folding/foldingModel';
import { ChevronDown, ChevronRight } from '../../icons';

import './LineNumber.css';

type Props = {
  lineNumber?: number;
  top: string;
  decorations: ViewModelDecoration[];
  right: string;
  width: number;
  decorationsWidth: number;
};

export const LineNumber: FunctionComponent<Props> = (props: Props) => {
  const { top, lineNumber, right, width, decorations, decorationsWidth } =
    props;

  const { editor } = useContext(EditorViewContext);

  const containerStyle: CSSProperties = {
    top,
    right,
  };

  const style: CSSProperties = {
    width: px(width),
    textAlign: 'right',
  };

  const icon = useMemo(() => {
    if (!decorations.length) {
      return <></>;
    }

    const className = decorations[0].options.firstLineDecorationClassName;

    if (className && className.includes('folding-collapsed')) {
      return (
        <div
          className={'decoration'}
          style={{ width: px(decorationsWidth) }}
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
          <ChevronRight />
        </div>
      );
    }

    if (className && className.includes('folding-expanded')) {
      return (
        <div
          className={'decoration'}
          style={{ width: px(decorationsWidth) }}
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
          <ChevronDown />
        </div>
      );
    }
    return <></>;
  }, [decorations, editor, lineNumber]);

  return (
    <div style={containerStyle} className={'line-number-container'}>
      <div style={style}>{lineNumber}</div>
      {icon}
    </div>
  );
};
