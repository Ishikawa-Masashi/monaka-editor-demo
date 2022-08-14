import { useCallback, useState } from 'react';

export type ContentRect = Pick<
  DOMRectReadOnly,
  'x' | 'y' | 'top' | 'left' | 'right' | 'bottom' | 'height' | 'width'
>;

export const useMeasure = <T extends HTMLElement>(): [
  (instance: T | null) => void,
  ContentRect
] => {
  const [rect, set] = useState<ContentRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  const [observer] = useState(
    () =>
      new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          set(entry.contentRect);
        }
      })
  );

  const ref = useCallback(
    (node: T | null) => {
      observer.disconnect();
      if (node) {
        observer.observe(node);
      }
    },
    [observer]
  );
  return [ref, rect];
};
