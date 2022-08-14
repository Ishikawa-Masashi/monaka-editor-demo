import * as React from 'react';
import { useContext, createContext } from 'react';
import { EditorViewContext } from './EditorViewContext';

const initialState = {
  indents: [] as JSX.Element[][],
};

export const IndentGuidesContext = createContext(initialState);

type Props = {
  children: React.ReactNode;
};

export const IndentGuidesProvider: React.FC<Props> = (props) => {
  const { children } = props;

  const { editor, renderingContext: ctx } = useContext(EditorViewContext);

  const indents = React.useMemo(() => {
    const spaceWidth = 10;

    // const ctx = renderingContext;

    if (!ctx) {
      return [];
    }
    const modelPosition = editor.getPosition();
    if (!modelPosition) {
      return [];
    }
    const viewPosition = ctx.viewportData.convertModelPositionToViewPosition(
      modelPosition.lineNumber,
      modelPosition.column
    );

    const primaryLineNumber = viewPosition.lineNumber;
    // if (!this._enabled) {

    if (!primaryLineNumber) {
      return [];
    }

    //   this._renderResult = null;
    //   return;
    // }

    const visibleStartLineNumber = ctx.visibleRange.startLineNumber;
    const visibleEndLineNumber = ctx.visibleRange.endLineNumber;

    const { indentSize } = ctx.viewportData
      .getViewModel()
      .getTextModelOptions();
    // const { indentSize } = this._context.model.getTextModelOptions();
    const indentWidth = indentSize * spaceWidth;
    const scrollWidth = ctx.scrollWidth;
    // const lineHeight = this._lineHeight;

    // const indents = this._context.model.getLinesIndentGuides(
    //     visibleStartLineNumber,
    //     visibleEndLineNumber
    //     );
    const viewModel = ctx.viewportData.getViewModel();

    const indents = viewModel.getLinesIndentGuides(
      visibleStartLineNumber,
      visibleEndLineNumber
    );

    let activeIndentStartLineNumber = 0;
    let activeIndentEndLineNumber = 0;
    let activeIndentLevel = 0;
    // if (this._activeIndentEnabled && this._primaryLineNumber) {
    if (primaryLineNumber) {
      const activeIndentInfo = viewModel.getActiveIndentGuide(
        primaryLineNumber,
        visibleStartLineNumber,
        visibleEndLineNumber
      );
      activeIndentStartLineNumber = activeIndentInfo.startLineNumber;
      activeIndentEndLineNumber = activeIndentInfo.endLineNumber;
      activeIndentLevel = activeIndentInfo.indent;
    }

    const output = [];
    for (
      let lineNumber = visibleStartLineNumber;
      lineNumber <= visibleEndLineNumber;
      lineNumber++
    ) {
      const containsActiveIndentGuide =
        activeIndentStartLineNumber <= lineNumber &&
        lineNumber <= activeIndentEndLineNumber;
      const lineIndex = lineNumber - visibleStartLineNumber;
      const indent = indents[lineIndex];

      const result = [];
      if (indent >= 1) {
        // const leftMostVisiblePosition = ctx.visibleRangeForPosition(
        //   new Position(lineNumber, 1)
        // );
        // let left = leftMostVisiblePosition ? leftMostVisiblePosition.left : 0;
        for (let i = 1; i <= indent; i++) {
          const content = '\xa0'.repeat(indentSize);

          const className =
            containsActiveIndentGuide && i === activeIndentLevel
              ? 'cigra'
              : 'cigr';
          result.push(
            <span key={i} className={className}>
              {content}
            </span>
          );
          //   result += `<div class="${className}" style="left:${left}px;height:${lineHeight}px;width:${indentWidth}px"></div>`;
          //   left += indentWidth;
          //   if (
          //     left > scrollWidth ||
          //     (this._maxIndentLeft > 0 && left > this._maxIndentLeft)
          //   ) {
          //     break;
          //   }
        }
      }
      output[lineIndex] = result;
    }
    return output;
    // this._renderResult = output;
  }, [ctx, editor]);

  const value = {
    indents,
  };

  return (
    <IndentGuidesContext.Provider value={value}>
      {children}
    </IndentGuidesContext.Provider>
  );
};
