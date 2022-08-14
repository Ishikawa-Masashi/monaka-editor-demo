// states/writingMode.ts
import {
  atom,
  useAtom,
  useAtomWithSelector,
} from '@ishikawa-masashi/react-atomic-state';

export enum WritingMode {
  LeftToRightHorizontalWriting,
  LeftToRightVerticalWriting,
  RightToLeftHorizontalWriting,
  RightToLeftVerticalWriting,
}

const writingMode = atom(WritingMode.LeftToRightHorizontalWriting);

export const setWritingMode = (mode: WritingMode) => writingMode.set(mode);

// create a custom hook
export const useWritingMode = () => useAtom(writingMode);

// create a custom hook with selector
// export const useStringCount = () =>
//   useAtomWithSelector(count, (count) => count.toString());

export let leftToRightHorizontalWriting = false;

const unsubscribe = writingMode.subscribe((value) => {
  console.log(value); // log every update
  leftToRightHorizontalWriting =
    value === WritingMode.LeftToRightHorizontalWriting;
});
