import * as React from 'react';
import {
  FunctionComponent,
  useContext,
  useCallback,
  useMemo,
  useEffect,
  useState,
  CSSProperties,
} from 'react';
import {
  useFontInfo,
  useLayoutInfo,
  useOnClickOutside,
  useRefEffect,
  useStyleKeys,
} from '../../hooks';
import * as editorCommon from '../../vs/editor/common/editorCommon';
import { EditorViewContext } from '../../contexts/EditorViewContext';

import './TextAreaInput.css';
import { Position } from '../../vs/editor/common/core/position';
import { px } from '../../utilities';
import { WritingMode } from '../../config/writingMode';
import { SuggestController } from '../../vs/editor/contrib/suggest/suggestController';
import { CompletionMenu } from './components';

type Props = {
  offset: number;
  wordWrap?: boolean;
};

type ModiferKey = {
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
};

export interface ITypeData {
  text: string;
  replacePrevCharCnt: number;
  replaceNextCharCnt: number;
  positionDelta: number;
}

export class TextAreaState {
  public static readonly EMPTY = new TextAreaState('', 0, 0, null, null);

  public readonly value: string;
  public readonly selectionStart: number;
  public readonly selectionEnd: number;
  public readonly selectionStartPosition: Position | null;
  public readonly selectionEndPosition: Position | null;

  constructor(
    value: string,
    selectionStart: number,
    selectionEnd: number,
    selectionStartPosition: Position | null,
    selectionEndPosition: Position | null
  ) {
    this.value = value;
    this.selectionStart = selectionStart;
    this.selectionEnd = selectionEnd;
    this.selectionStartPosition = selectionStartPosition;
    this.selectionEndPosition = selectionEndPosition;
  }

  public static selectedText(text: string): TextAreaState {
    return new TextAreaState(text, 0, text.length, null, null);
  }
}

export const TextAreaInput: FunctionComponent<Props> = (props) => {
  const { offset, wordWrap = false } = props;

  const {
    editor,
    renderingContext: ctx,
    writingMode,
  } = useContext(EditorViewContext);

  const { widthKey, heightKey, topKey } = useStyleKeys();
  const { layoutInfo } = useLayoutInfo();
  const { fontInfo } = useFontInfo();

  const textAreaRef = useRefEffect<HTMLTextAreaElement>((textArea) => {
    textArea.focus();
  });

  const [textAreaState, setTextAreaState] = useState(TextAreaState.EMPTY);

  // const [state, setState] = useState({
  //   text: '',
  //   replacePrevCharCnt: 0,
  //   replaceNextCharCnt: 0,
  //   positionDelta: 0,
  // });

  const [isDoingComposition, setIsDoingComposition] = useState(false);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);

  const [startPosition, setStartPosition] = useState<Position>();
  const [endPosition, setEndPosition] = useState<Position>();

  const [content, setContent] = useState('');

  const [controller, setController] = useState<SuggestController>();

  // useOnClickOutside(textAreaRef, () => {
  //   if (textAreaRef.current) {
  //     textAreaRef.current.style.display = 'none';
  //   }
  //   // setIsDoingComposition(false);
  // });

  const focus = () => {
    textAreaRef.current?.focus();
  };

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', (ev) => textAreaRef.current?.focus(), {
      capture: true,
    });
    return () => {
      window.removeEventListener(
        'keydown',
        (ev) => textAreaRef.current?.focus(),
        {
          capture: true,
        }
      );
    };
  }, []);
  useEffect(() => {
    editor.onDidFocusEditorText(() => {
      console.log('Focus!');
      textAreaRef.current?.focus();
    });
  }, [editor, textAreaRef]);

  useEffect(() => {
    const controller = SuggestController.get(editor);
    // console.log(controller);
    setController(controller);
    // controller.model.onDidSuggest((e) => {
    //   console.log(e);
    // });
  }, [editor]);

  const handler: Record<string, (modiferKey: ModiferKey) => void> =
    useMemo(() => {
      return {
        Backspace: (modiferKey) => {
          editor.trigger(null, 'deleteLeft', null);
        },
        Enter: () => {
          editor.trigger('keyboard', editorCommon.Handler.Type, { text: '\n' });
        },
        Shift: () => {
          // editor.trigger('keyboard', editorCommon.Handler.Type, { text: '\n' });
        },
        Alt: () => {
          // editor.trigger('keyboard', editorCommon.Handler.Type, { text: '\n' });
        },
        ArrowLeft: () => {
          editor.trigger('keyboard', 'cursorLeft', {});
        },
        ArrowRight: () => {
          editor.trigger(
            'keyboard',
            editorCommon.Handler.CompositionEnd,
            undefined
          );
          editor.trigger('keyboard', 'cursorRight', {});
        },
        ArrowUp: (modiferKey) => {
          editor.trigger(
            'keyboard',
            editorCommon.Handler.CompositionEnd,
            undefined
          );
          if (modiferKey.shiftKey) {
            editor.trigger('keyboard', 'cursorUpSelect', {});
            return;
          }

          editor.trigger('keyboard', 'cursorUp', {});
        },
        ArrowDown: () => {
          editor.trigger(
            'keyboard',
            editorCommon.Handler.CompositionEnd,
            undefined
          );
          editor.trigger('keyboard', 'cursorDown', {});
        },
        KanjiMode: () => {
          // console.log('CompositionStart');
          // editor.trigger('', editorCommon.Handler.CompositionStart, undefined);
          // setIsDoingComposition(true);
        },
        Control: () => {},
      };
    }, [editor]);

  const onKeyDown = useCallback(
    (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
      evt.preventDefault();

      const { key, shiftKey, ctrlKey, altKey, metaKey } = evt;

      if (key === 'Process') {
        return;
      }
      if (handler[key]) {
        handler[key]({ shiftKey, ctrlKey, altKey, metaKey });
        return;
      }

      if (isDoingComposition) {
        return;
      }

      editor.trigger('keyboard', editorCommon.Handler.Type, {
        text: key,
      });
      controller?.triggerSuggest();
      if (textAreaRef.current) {
        textAreaRef.current.value = '';
      }
    },
    [editor, isDoingComposition, handler, textAreaRef]
  );

  /**
   * Deduce the composition input from a string.
   */
  const deduceComposition = useCallback(
    (text: string): [TextAreaState, ITypeData] => {
      const oldState = textAreaState;
      const newState = TextAreaState.selectedText(text);
      const typeInput: ITypeData = {
        text: newState.value,
        replacePrevCharCnt: oldState.selectionEnd - oldState.selectionStart,
        replaceNextCharCnt: 0,
        positionDelta: 0,
      };
      return [newState, typeInput];
    },
    [textAreaState]
  );

  useEffect(() => {
    if (isDoingComposition) {
      return;
    }
    setLeft(offset);
  }, [offset, isDoingComposition]);

  const containerStyle: CSSProperties = useMemo(() => {
    if (!ctx) {
      return {};
    }

    // switch (writingMode) {
    //   case WritingMode.LeftToRightHorizontalWriting:
    //   default:
    //     break;
    // }

    if (writingMode === WritingMode.RightToLeftVerticalWriting) {
      return {
        top: px(ctx.scrollLeft),
        width: '1000px',
        lineHeight: px(fontInfo.lineHeight),
        height: px(ctx?.viewportWidth! - fontInfo.fontSize),
      };
    }
    return {
      left: px(ctx.scrollLeft),
      height: px(1000),
      lineHeight: px(fontInfo.lineHeight),
      width: px(layoutInfo.contentWidth - layoutInfo.verticalScrollbarWidth),
    };
  }, [ctx, fontInfo, top, writingMode, layoutInfo]);

  const inputStyle: CSSProperties = useMemo(() => {
    switch (writingMode) {
      case WritingMode.RightToLeftVerticalWriting:
        return {
          height: '100%',
          width: '1000px',
          textIndent: px(left - ctx!.scrollLeft),
        };
      default:
        break;
    }

    return {
      width: '100%',
      height: '1000px',
      textIndent: px(left - ctx!.scrollLeft),
    };
  }, [left, ctx]);

  const textIndentStyle: CSSProperties = useMemo(() => {
    switch (writingMode) {
      case WritingMode.RightToLeftVerticalWriting:
        return { height: px(left - ctx!.scrollLeft) };
      default:
        break;
    }
    return { width: px(left - ctx!.scrollLeft) };
  }, [left, ctx, writingMode]);

  return (
    <div style={containerStyle} className={'text-area-input-container'}>
      <div className={'text-area-content'}>
        <span className={'text-indent'} style={textIndentStyle}></span>
        <span id="hide">{content}</span>
        {/* <CompletionMenu controller={controller} /> */}
      </div>
      <textarea
        style={inputStyle}
        // wrap={'soft'}
        autoCorrect={'off'}
        autoCapitalize={'off'}
        autoComplete={'off'}
        spellCheck={false}
        className="inputarea"
        ref={textAreaRef}
        onChange={(evt) => {
          setContent(evt.target.value);
        }}
        onBlur={(evt) => {
          setIsDoingComposition(false);

          editor.trigger(
            'keyboard',
            editorCommon.Handler.CompositionEnd,
            undefined
          );
          setTextAreaState(TextAreaState.EMPTY);
          if (textAreaRef.current) {
            textAreaRef.current.value = '';
          }
          controller?.cancelSuggestWidget();
        }}
        onInput={(evt) => {
          // const textArea = textAreaRef.current;
          // if (textArea) {
          //   textArea.style.width = textArea.scrollWidth + 'px';
          // }
        }}
        onKeyDown={onKeyDown}
        onCompositionStart={(evt) => {
          if (textAreaRef.current) {
            textAreaRef.current.value = '';
          }
          setTextAreaState(TextAreaState.EMPTY);
          editor.trigger('keyboard', editorCommon.Handler.CompositionStart, {});
          setIsDoingComposition(true);
        }}
        onCompositionUpdate={(evt) => {
          if (wordWrap) {
            return;
          }
          // setIsDoingComposition(true);
          const [newState, typeInput] = deduceComposition(evt.data);
          editor.trigger(
            'keyboard',
            editorCommon.Handler.CompositionType,
            typeInput
          );
          setTextAreaState(newState);

          const pos = editor.getPosition();
          if (pos && startPosition) {
            // editor.revealPosition(pos);
            // editor.setSelections([Range.fromPositions(startPosition, pos)]);
          }
        }}
        onCompositionEnd={(evt) => {
          console.log('onCompositionEnd');

          const [newState, typeInput] = deduceComposition(evt.data || '');
          editor.trigger(
            'keyboard',
            editorCommon.Handler.CompositionType,
            typeInput
          );
          setTextAreaState(newState);
          editor.trigger(
            'keyboard',
            editorCommon.Handler.CompositionEnd,
            undefined
          );
          if (textAreaRef.current) {
            textAreaRef.current.value = '';
          }

          setIsDoingComposition(false);

          setContent('');
        }}
      />
    </div>
  );
};
