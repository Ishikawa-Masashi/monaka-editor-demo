import * as React from 'react';
import {
  useContext,
  createContext,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import { EditorViewContext } from './EditorViewContext';
import { ConfigurationChangedEvent } from '../vs/editor/common/config/editorOptions';

const initialState = {
  configurationChangedEvent: undefined as ConfigurationChangedEvent | undefined,
};

export const ConfigurationChangedEventContext = createContext(initialState);

type Props = React.PropsWithChildren<{
  // nothing
}>;

export const ConfigurationChangedEventProvider: FunctionComponent<Props> = (
  props
) => {
  const { children } = props;

  const { editor } = useContext(EditorViewContext);

  const [configurationChangedEvent, setConfigurationChangedEvent] =
    useState<ConfigurationChangedEvent>();

  useEffect(() => {
    editor.onDidChangeConfiguration((evt) => {
      setConfigurationChangedEvent(evt);
    });
  }, [editor]);

  const value = {
    configurationChangedEvent,
  };

  return (
    <ConfigurationChangedEventContext.Provider value={value}>
      {children}
    </ConfigurationChangedEventContext.Provider>
  );
};
