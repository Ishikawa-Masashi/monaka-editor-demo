/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './vs/editor/editor.main';

export { StandaloneCodeEditor, Selection } from './vs';
export * from './vs';

export { Editor, createEditor } from './components/editor';
export { WritingMode } from './config/writingMode';
export type { MonacoEditorHandle } from './components/editor';

export { setModelLanguage } from './vs/editor/standalone/browser/standaloneEditor';
