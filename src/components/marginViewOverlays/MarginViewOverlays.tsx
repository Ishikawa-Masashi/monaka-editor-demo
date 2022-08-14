import * as React from 'react';
import { useContext } from 'react';
import { useState, useEffect, CSSProperties, FunctionComponent } from 'react';
import { useFontInfo, useLayoutInfo } from '../../hooks';

import './MarginViewOverlays.css';

type Props = { children: React.ReactNode };

export const MarginViewOverlays: React.FC<Props> = (props) => {
  const { children } = props;
  const { fontInfo } = useFontInfo();
  const { layoutInfo } = useLayoutInfo();

  const [lineHeight, setLineHeight] = useState(10);

  useEffect(() => {
    if (fontInfo) {
      const { lineHeight } = fontInfo;
      setLineHeight(lineHeight);
    }
  }, [fontInfo]);

  const style: CSSProperties = {
    lineHeight: `${lineHeight}px`,
    width: `${layoutInfo.lineNumbersWidth}`,
  };

  return (
    <div className={'margin-view-overlays'} style={style}>
      {children}
    </div>
  );
};
