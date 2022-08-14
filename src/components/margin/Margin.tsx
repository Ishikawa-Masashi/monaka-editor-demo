import * as React from 'react';
import { useContext } from 'react';
import { CSSProperties, useEffect, useState, FunctionComponent } from 'react';
import { EditorViewContext } from '../../contexts/EditorViewContext';
import { px } from '../../utilities';
import { WritingMode } from '../../config/writingMode';
import { useFontInfo, useLayoutInfo } from '../../hooks';

import './Margin.css';

type Props = {
  // renderingContext: RenderingContext;
  // layoutInfo: EditorLayoutInfo;
  children: React.ReactNode;
};

export const Margin: FunctionComponent<Props> = (props) => {
  const { children } = props;

  const { renderingContext: ctx, writingMode } = useContext(EditorViewContext);
  const { layoutInfo } = useLayoutInfo();
  const { fontInfo } = useFontInfo();

  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [top, setTop] = useState('');
  const [right, setRight] = useState('');

  useEffect(() => {
    if (
      layoutInfo &&
      writingMode === WritingMode.LeftToRightHorizontalWriting
    ) {
      setWidth(px(layoutInfo.contentLeft));
      // setHeight('unset');
      return;
    }

    if (layoutInfo && writingMode === WritingMode.RightToLeftVerticalWriting) {
      setHeight(px(layoutInfo.contentLeft));
      return;
    }
    return () => {};
  }, [layoutInfo, writingMode]);

  useEffect(() => {
    if (ctx && writingMode === WritingMode.LeftToRightHorizontalWriting) {
      const height = Math.min(ctx.scrollHeight, 1000000);
      setHeight(px(height));

      const adjustedScrollTop = ctx.scrollTop - ctx.bigNumbersDelta;

      setTop(`${-adjustedScrollTop}px`);
      setRight('unset');
      return;
    }

    if (ctx && writingMode === WritingMode.RightToLeftVerticalWriting) {
      const width = Math.min(ctx.scrollHeight, 1000000);
      setWidth(px(width));

      const adjustedScrollTop = ctx.scrollTop - ctx.bigNumbersDelta;
      setRight(`${-adjustedScrollTop}px`);
      setTop('unset');

      return;
    }
  }, [ctx, writingMode]);

  if (!ctx) {
    return <></>;
  }

  const style: CSSProperties = {
    top,
    right,
    height,
    width,
    fontFamily: fontInfo.fontFamily,
    letterSpacing: fontInfo.letterSpacing,
  };

  return (
    <div className={'margin'} style={style}>
      {children}
    </div>
  );
};
