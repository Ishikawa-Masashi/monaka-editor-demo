/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
  CommonEditorConfiguration,
  IEnvConfiguration,
} from '../../../../../vs/editor/common/config/commonEditorConfig';
import {
  IEditorOptions,
  EditorFontLigatures,
} from '../../../../../vs/editor/common/config/editorOptions';
import {
  BareFontInfo,
  FontInfo,
} from '../../../../../vs/editor/common/config/fontInfo';
import { AccessibilitySupport } from '../../../../../vs/platform/accessibility/common/accessibility';
import { IDimension } from '../../../common/editorCommon';

export class TestConfiguration extends CommonEditorConfiguration {
  private width = 100;
  private height = 100;

  constructor(opts: IEditorOptions) {
    super(false, opts);
    this._recomputeOptions();
  }

  public override observeReferenceElement(dimension?: IDimension): void {
    this.width = dimension?.width!;
    this.height = dimension?.height!;
  }

  protected _getEnvConfiguration(): IEnvConfiguration {
    return {
      extraEditorClassName: '',
      // outerWidth: 100,
      // outerHeight: 100,
      outerWidth: this.width,
      outerHeight: this.height,
      emptySelectionClipboard: true,
      pixelRatio: 1,
      zoomLevel: 0,
      accessibilitySupport: AccessibilitySupport.Unknown,
    };
  }

  protected readConfiguration(styling: BareFontInfo): FontInfo {
    return new FontInfo(
      {
        zoomLevel: 0,
        pixelRatio: 1,
        fontFamily: 'mockFont',
        fontWeight: 'normal',
        fontSize: 14,
        fontFeatureSettings: EditorFontLigatures.OFF,
        lineHeight: 19,
        letterSpacing: 1.5,
        isMonospace: true,
        typicalHalfwidthCharacterWidth: 10,
        typicalFullwidthCharacterWidth: 20,
        canUseHalfwidthRightwardsArrow: true,
        spaceWidth: 10,
        middotWidth: 10,
        wsmiddotWidth: 10,
        maxDigitWidth: 10,
      },
      true
    );
  }
}
