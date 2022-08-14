export function getRect(element?: HTMLElement): DOMRect {
  if (!element) {
    return {
      x: 0,
      y: 0,
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      toJSON: () => {},
    };
  }

  return element.getBoundingClientRect();
}
