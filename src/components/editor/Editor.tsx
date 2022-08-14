import * as React from 'react';
import {
  CSSProperties,
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
  useRef,
  forwardRef,
} from 'react';

import { OverflowGuard } from '../overflowGuard';
import { Margin } from '../margin';
import { MarginViewOverlays } from '../marginViewOverlays';
import { ScrollableElement } from '../scrollableElement';
import { EditorScrollbar } from '../editorScrollbar';
import { LinesContent } from '../linesContent';
import { LineNumbers } from '../lineNumbers';
import { TextAreaInput } from '../textAreaInput';

import { StandaloneCodeEditor } from '../../vs/editor/standalone/browser/standaloneCodeEditor';
import { EditorOption } from '../../vs/editor/common/config/editorOptions';

import { ViewLines } from '../viewLines';

import { IContextKeyServiceTarget } from '../../vs/platform/contextkey/common/contextkey';
import { create } from '../../vs/editor/standalone/browser/standaloneEditor';
import { EditorViewProvider } from '../../contexts/EditorViewContext';
import { ITextModel } from '../../vs/editor/common/model';
import { useConst } from '../../hooks';
import { Minimap } from '../minimap';
import { FindWidget } from '../findWidget';
import { IndentGuidesProvider } from '../../contexts/IndentGuidesContext';
import { DecorationsProvider } from '../../contexts/DecorationsContext';
import { useHotkeys } from '@ishikawa-masashi/react-hooks';
import { ViewCursors } from '../viewCursors/ViewCursors';
import { Selections } from '../selections';
import { WritingMode } from '../../config/writingMode';

import './Editor.css';
import './test.scss';
import { LineDecorations } from '../lineDecorations';
import { useCount } from '../states/count';

export type WordWrapType = 'off' | 'on' | 'wordWrapColumn' | 'bounded';

export type EditorOptions = {
  writingMode?: WritingMode;
  wordWrap?: WordWrapType;
};

type Props = {
  options?: EditorOptions;
  model: ITextModel;
};

export type MonacoEditorHandle = {};

class TestEditorDomElement {
  parentElement: IContextKeyServiceTarget | null = null;
  setAttribute(attr: string, value: string): void {}
  removeAttribute(attr: string): void {}
  hasAttribute(attr: string): boolean {
    return false;
  }
  getAttribute(attr: string): string | undefined {
    return undefined;
  }
  addEventListener(event: string): void {}
  removeEventListener(event: string): void {}
  appendChild(node: Node): void {}
  removeChild(node: Node): void {}
  contains(node: Node) {
    return false;
  }
}

export function createEditor(): StandaloneCodeEditor {
  const editor = create(new TestEditorDomElement() as any, {
    value: "function hello() {\n\talert('Hello world!');\n}",
    language: 'javascript',
    //     // language: "typescript",
    // wordWrap: 'wordWrapColumn',
    // wordWrap: 'on',
    // wordWrapColumn: 40,

    // // Set this to false to not auto word wrap minified files
    // wordWrapMinified: true,

    // // try "same", "indent" or "none"
    // wrappingIndent: 'indent',
  });
  console.log('create editor!');
  return editor as StandaloneCodeEditor;
}

export const Editor = forwardRef<MonacoEditorHandle, Props>((props, ref) => {
  const { model, options = {} } = props;

  const editor = useConst(() => createEditor());
  const {
    writingMode = WritingMode.LeftToRightHorizontalWriting,
    wordWrap = 'off',
  } = options;

  useEffect(() => {
    editor.setModel(model);

    return () => {
      // model.dispose();
    };
  }, [editor, model]);

  useEffect(() => {
    editor.updateOptions({ wordWrap });
  }, [editor, wordWrap]);

  useEffect(() => {
    return () => {
      editor.dispose();
    };
  }, []);

  return (
    <EditorViewProvider editor={editor} options={{ writingMode, wordWrap }}>
      <OverflowGuard>
        <Margin>
          <MarginViewOverlays>
            <LineNumbers />
          </MarginViewOverlays>
        </Margin>
        <EditorScrollbar options={editor.getOptions()}>
          <LinesContent>
            <IndentGuidesProvider>
              <DecorationsProvider>
                <Selections />
                <LineDecorations />
                <ViewLines />
                <ViewCursors />
              </DecorationsProvider>
            </IndentGuidesProvider>
          </LinesContent>
        </EditorScrollbar>
        <Minimap />
        {/* <FindWidget /> */}
      </OverflowGuard>
    </EditorViewProvider>
  );
});
