import { px } from './px';

export const enum WritingMode {
  LeftToRightHorizontalWriting, // 英語
  RightToLeftHorizontalWriting, // アラビア語
  RightToLeftVerticalWriting, // 日本語
  LeftToRightVerticalWriting, // モンゴル語
}

// coordinatesConverter
class CSSPropertiesConverter {
  public getAllProperties() {}
}

// CSSProperties
export class CascadingStyleSheets {
  private _top = 0;
  constructor(private readonly writingMode: WritingMode) {}

  set top(value: number) {
    this._top = value;
  }

  get top(): number {
    return this._top;
  }

  public toCSSProperties() {
    if (this.writingMode === WritingMode.RightToLeftVerticalWriting) {
      const top = this.top;
      return {
        top: px(top),
      };
    }

    // this.writingMode === WritingMode.LeftToRightHorizontalWriting
    const top = this.top;
    return {
      top: px(top),
    };
  }
}
