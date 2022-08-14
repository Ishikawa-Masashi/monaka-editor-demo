import { useState, useRef, useEffect, RefObject } from 'react';

export const useBoundingBox = <T extends HTMLElement>(): [
  Partial<DOMRect>,
  RefObject<T | undefined>
] => {
  const ref = useRef<T>();
  const [bbox, setBbox] = useState<Partial<DOMRect>>({});

  const set = () =>
    setBbox(ref && ref.current ? ref.current.getBoundingClientRect() : {});

  useEffect(() => {
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);

  return [bbox, ref];
};
