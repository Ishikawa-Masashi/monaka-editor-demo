import * as React from 'react';

import { StandaloneCodeEditor, RenderingContext } from '../vs';

export function useRenderingContext(editor: StandaloneCodeEditor) {
  const [renderingContext, setRenderingContext] =
    React.useState<RenderingContext>();

  React.useEffect(() => {
    editor.onDidRender((evt) => {
      setRenderingContext(evt);
    });

    return () => {
      // editor.dispose();
    };
  }, [editor]);

  return renderingContext;
}
