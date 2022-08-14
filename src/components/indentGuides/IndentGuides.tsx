import * as React from 'react';
import { useContext } from 'react';
import { useMemo, FunctionComponent } from 'react';
import { EditorViewContext } from '../../contexts/EditorViewContext';
import { IndentGuidesContext } from '../../contexts/IndentGuidesContext';

import './IndentGuides.css';

type Props = {
  viewLineNumber: number;
};

export const IndentGuides: FunctionComponent<Props> = (props) => {
  const { viewLineNumber } = props;

  const { renderingContext: ctx } = useContext(EditorViewContext);
  const { indents } = useContext(IndentGuidesContext);

  const children = useMemo(() => {
    if (!ctx) {
      return [];
    }

    if (!indents) {
      return [];
    }

    const visibleStartLineNumber = ctx.visibleRange.startLineNumber;

    return indents[viewLineNumber - visibleStartLineNumber];
  }, [ctx, indents, viewLineNumber]);

  return <div className={'indent-guides'}>{children}</div>;
};
