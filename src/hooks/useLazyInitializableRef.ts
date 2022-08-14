import * as React from 'react';
import { useState } from 'react';
// useRef () will initialize a reference on every render.
// useState () allows initialization only on first render.
// https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
export function useLazyInitializableRef<T>(create: () => T): T {
  const [value] = useState(create);
  return value;
}
