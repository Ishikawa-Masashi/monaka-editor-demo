export enum WritingMode {
  LeftToRightHorizontalWriting,
  LeftToRightVerticalWriting,
  RightToLeftHorizontalWriting,
  RightToLeftVerticalWriting,
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const from = (writingMode: WritingMode) => {
  return {
    toString: () => {
      switch (writingMode) {
        case WritingMode.LeftToRightHorizontalWriting:
          return 'left-to-right-horizontal-writing';
        case WritingMode.LeftToRightVerticalWriting:
          return 'left-to-right-vertical-writing';
        case WritingMode.RightToLeftHorizontalWriting:
          return 'right-to-left-horizontal-writing';
        case WritingMode.RightToLeftVerticalWriting:
          return 'right-to-left-vertical-writing';
        default:
          break;
      }
      return 'left-to-right-horizontal-writing';
    },
    toCSSProperties: () => {
      switch (writingMode) {
        case WritingMode.LeftToRightHorizontalWriting:
          return 'horizontal-tb';
        // case WritingMode.LeftToRightVerticalWriting:
        // return 'left-to-right-vertical-writing';
        // case WritingMode.RightToLeftHorizontalWriting:
        // return 'right-to-left-horizontal-writing';
        case WritingMode.RightToLeftVerticalWriting:
          return 'vertical-rl';
        default:
          break;
      }
      return 'horizontal-tb';
    },
  };
};
