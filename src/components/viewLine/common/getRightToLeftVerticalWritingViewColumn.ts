const range = document.createRange();

function contains(
  textNode: Text,
  y: number,
  start: number,
  end: number
): boolean {
  range.setStart(textNode, start);
  range.setEnd(textNode, end);

  const rect = range.getBoundingClientRect();
  return rect.top <= y && y < rect.bottom;
}

export function getRightToLeftVerticalWritingViewColumn(
  element: Element,
  y: number,
  characterWidth: number
): number {
  //const ELEMENT_NODE = 1;
  const TEXT_NODE = 3;

  y += characterWidth / 2;

  let column = 1;
  const childNodes = element.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    const childNode = childNodes.item(i);
    const type = childNode.nodeType;

    const textNode =
      type === TEXT_NODE ? (childNode as Text) : (childNode.firstChild as Text);

    if (!textNode) {
      return column;
    }
    if (!textNode.data) {
      return column;
    }

    const length = textNode.data.length;
    let start = 0;
    let end = length;

    if (contains(textNode, y, start, end)) {
      while (end - start > 1) {
        const mid = Math.floor((end + start) / 2);
        if (contains(textNode, y, start, mid)) {
          end = mid;
        } else if (contains(textNode, y, mid, end)) {
          start = mid;
        }
      }
      column += start;
      break;
    }

    column += length;
  }

  return column;
}
