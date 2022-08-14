/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
function _format(message: string, args: any[]) {
  let result;
  if (args.length === 0) {
    result = message;
  } else {
    result = message.replace(/\{(\d+)\}/g, function (match, rest) {
      const index = rest[0];
      return typeof args[index] !== 'undefined' ? args[index] : match;
    });
  }
  return result;
}
export function localize(data: any, message: string, ...args: any[]) {
  return _format(message, args);
}
