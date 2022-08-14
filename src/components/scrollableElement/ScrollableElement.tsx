import * as React from 'react';
import { useContext, useEffect } from 'react';
import { EditorViewContext } from '../../contexts/EditorViewContext';
import { RenderingContext } from '../../vs/editor/common/view/renderingContext';

import './ScrollableElement.css';

type Props = {
  // renderingContext: RenderingContext;
};

export function ScrollableElement(props: Props) {
  //   const { renderingContext } = props;
  const { renderingContext } = useContext(EditorViewContext);

  useEffect(() => {}, [renderingContext]);

  return <div></div>;
}
