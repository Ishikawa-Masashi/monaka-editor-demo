import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { EditorOptions } from '../components/editor/Editor';
import {
  StandaloneCodeEditor,
  RenderingContext,
  Selection,
  IPosition,
} from '../vs';
import { useHotkeys } from '@ishikawa-masashi/react-hooks';
import { useMouseDownState, useRenderingContext } from '../hooks';
import { MouseDownState } from '../utilities';

enum WritingMode {
  LeftToRightHorizontalWriting,
  LeftToRightVerticalWriting,
  RightToLeftHorizontalWriting,
  RightToLeftVerticalWriting,
}

// export const enum Position {
//   LEFT,
//   RIGHT,
//   BOTTOM,
// }

// export enum ProductName {
//   ElectricTypewriter = 'Electric Typewriter',
//   QBasic = 'QBasic',
//   PocketScheme = 'Pocket Scheme',
//   Monaka = 'Monaka',
// }

export type AppState = {
  status: { line: number; column: number };
};

const initialState = {
  editor: undefined as unknown as StandaloneCodeEditor,
  writingMode: WritingMode.LeftToRightHorizontalWriting,
  renderingContext: undefined as RenderingContext | undefined,

  selection: undefined as Selection | undefined,
  selectionStart: undefined as IPosition | undefined,
  setSelectionStart: (selectionStart: IPosition | undefined) => {},

  leftToRightHorizontalWriting: true,
  rightToLeftVerticalWriting: false,
  wordWrap: 'off',
  scrollLeft: 0,
  mouseDownState: new MouseDownState(),
};

export const EditorViewContext = createContext(initialState);
// export const useAppContext = () => useContext(EditorViewContext);
export const useEditorViewContext = () => useContext(EditorViewContext);

const initialiCondition = {
  mediaType: ['comic', 'video'],
  title: '',
  // fav: null,
  // authors: [],
  // tags: [],
};

const initialSetting = {
  mode: 'list',
  // selectedId: null,
  // videoDir: null,
  // comicDir: null,
  condition: initialiCondition,
  sorter: { key: 'registeredAt', value: 'desc' },
  pager: { current: 1, size: 10 },
  autoFullscreen: true,
  movingStep: { video: 10, comic: 2 },
};

type Props = {
  editor: StandaloneCodeEditor;
  options?: EditorOptions;
  children: React.ReactNode;
  // productName: ProductName;
};

export const EditorViewProvider: React.FC<Props> = (props) => {
  const { children, options = {}, editor } = props;
  const {
    writingMode = WritingMode.LeftToRightHorizontalWriting,
    wordWrap = 'off',
  } = options;

  const renderingContext = useRenderingContext(editor);

  const [selection, setSelection] = useState<Selection>();
  const [selectionStart, setSelectionStart] = useState<IPosition | undefined>();

  const [initialized, changeInitialized] = useState(false);
  const [setting, changeSetting] = useState(initialSetting);

  const [scrollLeft, setScrollLeft] = useState(0);

  const initializeSetting = () => {
    //   const persistedSetting = await loadSetting();
    //   changeSetting({ ...setting, ...persistedSetting });
    // changeInitialized(true);
    // setTabGroups(tabGroups => [activeTabGroup]);
  };

  const { mouseDownState } = useMouseDownState();

  const leftToRightHorizontalWriting = useMemo(
    () => writingMode === WritingMode.LeftToRightHorizontalWriting,
    [writingMode]
  );

  const rightToLeftVerticalWriting = useMemo(
    () => writingMode === WritingMode.RightToLeftVerticalWriting,
    [writingMode]
  );

  useEffect(() => {
    if (renderingContext) {
      setScrollLeft(renderingContext.scrollLeft);
    }
  }, [renderingContext]);

  useEffect(() => {
    editor.onDidChangeCursorSelection((evt) => {
      const { selection } = evt;
      console.log('Change Selection!');

      setSelection(selection);
    });

    return () => {
      // editor.dispose();
    };
  }, [editor]);

  useHotkeys('Control+z', (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    editor.focus();
    editor.trigger(undefined, 'undo', undefined);
  });

  useHotkeys('Shift+ArrowRight', (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    editor.focus();
    editor.trigger('keyboard', 'cursorRightSelect', {});
  });

  // useHotkeys('Shift+ArrowUp', (evt) => {
  //   evt.stopPropagation();
  //   evt.preventDefault();
  //   editor.focus();
  //   editor.trigger('keyboard', 'cursorUpSelect', {});
  // });

  useHotkeys('Control+c', (evt) => {
    evt.stopPropagation();
    // evt.preventDefault();
    editor.focus();
    const model = editor.getModel();
    if (!model) {
      return;
    }
    const selection = editor.getSelection();
    if (!selection) {
      return;
    }

    const value = model.getValueInRange(selection);
    value && navigator.clipboard.writeText(value!);
    // editor.trigger(undefined, 'editor.action.clipboardCopyAction', undefined);
    // editorInstance.trigger('source','editor.action.clipboardPasteAction');
  });

  const value = {
    editor,
    renderingContext,
    selection,
    writingMode,
    selectionStart,
    setSelectionStart,
    leftToRightHorizontalWriting,
    rightToLeftVerticalWriting,
    wordWrap,
    scrollLeft,
    mouseDownState,
  };

  return (
    <EditorViewContext.Provider value={value}>
      {children}
    </EditorViewContext.Provider>
  );
};
