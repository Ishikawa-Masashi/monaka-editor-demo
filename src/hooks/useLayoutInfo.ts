import * as React from 'react';
import { EditorOption } from '../vs/editor/common/config/editorOptions';
import { useEditorViewContext } from '../contexts/EditorViewContext';

export function useLayoutInfo() {
  const { editor } = useEditorViewContext();

  const [layoutInfo, setLayoutInfo] = React.useState(
    editor.getOption(EditorOption.layoutInfo)
  );

  React.useEffect(() => {
    editor.onDidLayoutChange((evt) => {
      const layoutInfo = evt;
      setLayoutInfo(layoutInfo);
    });
  }, [editor]);

  return {
    layoutInfo,
  };
}
