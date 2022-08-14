import * as React from 'react';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { EditorViewContext } from '../../contexts/EditorViewContext';
import { EditorOption } from '../../vs/editor/common/config/editorOptions';
import {
  CommonFindController,
  FindStartFocusAction,
} from '../../vs/editor/contrib/find/findController';

import './FindWidget.css';

export const FindWidget: FunctionComponent = () => {
  const { editor } = useContext(EditorViewContext);

  const [controller, setController] = useState<CommonFindController>();
  useEffect(() => {
    const controller = CommonFindController.get(editor);
    if (!controller) {
      return; // false;
    }

    setController(controller);
    // return () => {};
  }, [editor]);

  useEffect(() => {
    if (!controller) {
      return;
    }
    controller.start({
      forceRevealReplace: false,
      seedSearchStringFromSelection: editor.getOption(EditorOption.find)
        .seedSearchStringFromSelection
        ? 'single'
        : 'none',
      seedSearchStringFromGlobalClipboard: editor.getOption(EditorOption.find)
        .globalFindClipboard,
      shouldFocus: FindStartFocusAction.FocusFindInput,
      shouldAnimate: true,
      updateSearchScope: false,
      loop: editor.getOption(EditorOption.find).loop,
    });
  }, [controller, editor]);

  return (
    <div className={'find-widget'}>
      <textarea
        onMouseDown={(evt) => {
          evt.stopPropagation();
        }}
        onFocus={(evt) => {}}
        onChange={(evt) => {
          // controller.start({});
          controller?.setSearchString(evt.target.value);
        }}
      ></textarea>
    </div>
  );
};
