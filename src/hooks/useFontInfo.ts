import * as React from 'react';
import { EditorOption } from '../vs/editor/common/config/editorOptions';
import { useEditorViewContext } from '../contexts/EditorViewContext';

export function useFontInfo() {
  const { editor } = useEditorViewContext();

  const [fontInfo, setFontInfo] = React.useState(
    editor.getOption(EditorOption.fontInfo)
  );

  React.useEffect(() => {
    editor.onDidChangeConfiguration((evt) => {
      if (evt.hasChanged(EditorOption.fontInfo)) {
        setFontInfo(editor.getOption(EditorOption.fontInfo));
      }
    });
  }, [editor]);

  return {
    fontInfo,
  };
}
