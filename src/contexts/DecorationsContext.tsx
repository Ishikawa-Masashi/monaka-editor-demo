import * as React from 'react';
import { useContext, createContext, useMemo } from 'react';
import { EditorViewContext } from './EditorViewContext';
import { ViewModelDecoration } from '../vs/editor/common/viewModel/viewModel';

const initialState = {
  decorations: [] as ViewModelDecoration[],
};

export const DecorationsContext = createContext(initialState);

type Props = {
  children: React.ReactNode;
};

export const DecorationsProvider: React.FC<Props> = (props) => {
  const { children } = props;

  const { renderingContext: ctx } = useContext(EditorViewContext);

  const decorations = useMemo(() => {
    if (!ctx) {
      return [];
    }

    const decorations = ctx.getDecorationsInViewport();
    return decorations;
  }, [ctx]);

  const value = {
    decorations,
  };

  return (
    <DecorationsContext.Provider value={value}>
      {children}
    </DecorationsContext.Provider>
  );
};
