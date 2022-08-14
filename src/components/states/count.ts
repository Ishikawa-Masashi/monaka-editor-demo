// states/count.ts
import {
  atom,
  useAtom,
  useAtomWithSelector,
} from '@ishikawa-masashi/react-atomic-state';

const count = atom(0);

export const decrement = () => count.set((prevCount) => prevCount - 1);
export const increment = () => count.set((prevCount) => prevCount + 1);

const unsubscribe = count.subscribe((value) => {
  console.log(value); // log every update
});

// create a custom hook
export const useCount = () => useAtom(count);

// create a custom hook with selector
export const useStringCount = () =>
  useAtomWithSelector(count, (count) => count.toString());
