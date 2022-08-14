import * as React from 'react';
import {
  FunctionComponent,
  useContext,
  useEffect,
  CSSProperties,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {
  IViewModel,
  ViewLineData,
} from '../../../vs/editor/common/viewModel/viewModel';

type Props = {
  viewLineData: ViewLineData;
  leftToRightHorizontalWriting?: boolean;
};

export const MinimapLine: FunctionComponent<Props> = (props) => {
  const { viewLineData, leftToRightHorizontalWriting = true } = props;
  const { tokens } = viewLineData;
  const content = viewLineData.content.replace(/\s/g, '\xa0');
  const result = [];
  let startIndex = 0;
  for (
    let tokenIndex = 0, tokensLen = tokens.getCount();
    tokenIndex < tokensLen;
    tokenIndex++
  ) {
    const endIndex = tokens.getEndOffset(tokenIndex);
    const foreground = tokens.getForeground(tokenIndex);

    result.push(
      <span key={tokenIndex} className={`mtk${foreground}`}>
        {content.slice(startIndex, endIndex)}
      </span>
    );
    startIndex = endIndex;
  }

  const style = leftToRightHorizontalWriting
    ? { transformOrigin: `top left`, transform: `scale(0.2)` }
    : { transformOrigin: `top right`, transform: `scale(0.2)` };

  return <div style={style}>{result}</div>;
};
