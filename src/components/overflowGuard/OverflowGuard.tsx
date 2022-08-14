import * as React from 'react';
import {
  CSSProperties,
  FunctionComponent,
  useContext,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { EditorViewContext } from '../../contexts/EditorViewContext';
import {
  useRefEffect,
  useOnClickInside,
  useMeasure,
  useStyleKeys,
} from '../../hooks';
import { css } from '../../utilities';
import { WritingMode, from } from '../../config/writingMode';

import './OverflowGuard.css';

/**
 * Returns the position of a dom node relative to the entire page.
 */
export function getDomNodePagePosition(domNode: HTMLElement) {
  let bb = domNode.getBoundingClientRect();
  return {
    left: bb.left + window.scrollX,
    top: bb.top + window.scrollY,
    width: bb.width,
    height: bb.height,
  };
}

type Props = {
  children: React.ReactNode;
};

type UpperPanelProps = {
  element: HTMLElement | null;
};

export function useValueRef<T>(val: T) {
  const ref = React.useRef(val);
  React.useEffect(() => {
    ref.current = val;
  }, [val]);
  return ref;
}

const UpperPanel: FunctionComponent<UpperPanelProps> = (props) => {
  const { element } = props;

  const [isInside, setIsInside] = useState(false);
  const isInsideRef = useValueRef(isInside);
  const intervalIDRef = useValueRef<number | undefined>(undefined);

  const { editor, selectionStart } = useContext(EditorViewContext);

  const editorRef = useValueRef(editor);
  const selectionStartRef = useValueRef(selectionStart);

  useEffect(() => {
    if (isInside) {
      if (intervalIDRef.current) {
        return;
      }
      intervalIDRef.current = setInterval(() => {
        // console.log(isInsideRef.current);
        if (selectionStartRef.current) {
          editorRef.current.trigger('keyboard', 'cursorUpSelect', {});
        }
      }, 1);
      return;
    }

    if (intervalIDRef.current) {
      clearInterval(intervalIDRef.current);
      intervalIDRef.current = undefined;
    }
  }, [isInside]);

  if (!element) {
    return <></>;
  }

  const clientRect = getDomNodePagePosition(element);

  const { width, height, top, left } = clientRect;

  const style: CSSProperties = {
    position: 'absolute',
    width: `${width}px`,
    height: `${height}px`,
    top: `${top - height}px`,
    left: `${left}px`,
    pointerEvents: selectionStartRef.current ? 'auto' : 'none',
    zIndex: 100,
  };

  return (
    <div
      style={style}
      onMouseEnter={() => {
        setIsInside(true);
      }}
      onMouseLeave={() => {
        console.log('leave!');
        setIsInside(false);
      }}
    ></div>
  );
};

export const OverflowGuard: FunctionComponent<Props> = (props) => {
  const { children } = props;

  const { writingMode, editor } = useContext(EditorViewContext);

  const { widthKey, heightKey } = useStyleKeys();

  const [ref, rect] = useMeasure();

  const onWheel = useCallback(
    (evt: React.WheelEvent<HTMLDivElement>) => {
      evt.stopPropagation();
      const { deltaY } = evt;

      const top = editor.getScrollTop();
      editor.setScrollTop(Math.max(0, top + deltaY / 4));
    },
    [editor]
  );

  const containerRef = useRefEffect<HTMLDivElement>((container) => {
    ref(container);
  });

  useOnClickInside(containerRef, (evt) => {
    // evt.stopPropagation();
    evt.preventDefault();
    editor.focus();
  });

  useEffect(() => {
    const width = rect[widthKey];
    const height = rect[heightKey];

    editor.layout({
      width,
      height,
    });
  }, [rect, writingMode, editor, widthKey, heightKey]);

  const style: CSSProperties = {
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    writingMode: from(writingMode).toCSSProperties(),
  };

  const classNames = css('overflow-guard', from(writingMode).toString());
  return (
    <div
      className="overflow-guard-container"
      ref={containerRef}
      onWheel={onWheel}
    >
      <div className={classNames} style={style}>
        {children}
      </div>
    </div>
  );
};
