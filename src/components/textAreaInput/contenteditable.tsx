import React from 'react';

type Props = {
  html: string;
  onChange?: (s: string) => void;
};

const noop = () => {};

export type ContentEditableHandle = {
  focus: () => void;
};

export const ContentEditable2 = React.forwardRef<ContentEditableHandle, Props>(
  (props, ref) => {
    const { html, onChange = noop } = props;
    const textAreaRef = React.useRef<HTMLDivElement>(null);
    const lastHtmlRef = React.useRef<string>('');

    React.useImperativeHandle(ref, () => ({
      focus() {
        textAreaRef.current?.focus();
      },
    }));

    const onInput = () => {
      const curHtml = textAreaRef.current?.innerHTML ?? '';
      if (curHtml !== lastHtmlRef.current) {
        onChange(curHtml);
      }
      lastHtmlRef.current = html;
    };

    React.useEffect(() => {
      if (!textAreaRef.current) {
        return;
      }
      if (textAreaRef.current.innerHTML === html) {
        return;
      }
      textAreaRef.current.innerHTML = html;
    }, [html]);

    return (
      <span
        onInput={onInput}
        contentEditable
        dangerouslySetInnerHTML={{ __html: html }}
        ref={textAreaRef}
      />
    );
  }
);
