import { useHotkeys } from '@ishikawa-masashi/react-hooks';
import React, {
  useEffect,
  useState,
  FunctionComponent,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { useEditorViewContext } from '../../../../contexts/EditorViewContext';
import { SuggestController } from '../../../../vs/editor/contrib/suggest/suggestController';
import { MenuItem } from '../menuItem';

import './completion-menu.scss';

type Props = {
  controller?: SuggestController;
};

export const CompletionMenu: FunctionComponent<Props> = (props) => {
  const { controller } = props;
  // const { editor, renderingContext: ctx, writingMode } = useEditorViewContext();

  const [items, setItems] = useState<string[]>([]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (controller) {
      controller.model.onDidSuggest((e) => {
        console.log(e);
        // e.completionModel.lineContext.leadingLineContent
        const items = [];
        for (const item of e.completionModel.items) {
          items.push(item.textLabel);
        }
        setItems(items);
      });

      controller.model.onDidCancel(() => {
        setItems([]);
      });
    }
  }, [controller]);

  const handler: Record<string, () => void> = useMemo(() => {
    return {
      Escape: () => {
        controller?.cancelSuggestWidget();
      },
      Backspace: () => {
        // editor.trigger(null, 'deleteLeft', null);
      },
      Enter: () => {
        // editor.trigger('keyboard', editorCommon.Handler.Type, { text: '\n' });
      },
      Shift: () => {
        // editor.trigger('keyboard', editorCommon.Handler.Type, { text: '\n' });
      },
      Alt: () => {
        // editor.trigger('keyboard', editorCommon.Handler.Type, { text: '\n' });
      },
      ArrowLeft: () => {
        // editor.trigger('keyboard', 'cursorLeft', {});
      },
      ArrowRight: () => {
        // editor.trigger(
        //   'keyboard',
        //   editorCommon.Handler.CompositionEnd,
        //   undefined
        // );
        // editor.trigger('keyboard', 'cursorRight', {});
      },
      ArrowUp: () => {
        // editor.trigger(
        //   'keyboard',
        //   editorCommon.Handler.CompositionEnd,
        //   undefined
        // );
        // editor.trigger('keyboard', 'cursorUp', {});
      },
      ArrowDown: () => {
        // editor.trigger(
        //   'keyboard',
        //   editorCommon.Handler.CompositionEnd,
        //   undefined
        // );
        // editor.trigger('keyboard', 'cursorDown', {});
        setSelectedIndex(selectedIndex + 1);
      },
      KanjiMode: () => {
        // console.log('CompositionStart');
        // editor.trigger('', editorCommon.Handler.CompositionStart, undefined);
        // setIsDoingComposition(true);
      },
      Control: () => {},
    };
  }, [selectedIndex, controller]);

  const onKeyDown = useCallback(
    (ev: KeyboardEvent) => {
      if (items.length) {
        ev.stopPropagation();
        ev.preventDefault();

        console.log(ev.key);
        if (handler[ev.key]) {
          handler[ev.key]();
          return;
        }
      }
    },
    [items, handler]
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [onKeyDown]);

  return (
    <div className={'completion-menu-container'} style={{ paddingTop: '19px' }}>
      <div className={'completion-menu'}>
        {items.map((value, index) => (
          <MenuItem
            key={index}
            textLabel={value}
            selected={selectedIndex === index}
          />
        ))}
      </div>
    </div>
  );
};
