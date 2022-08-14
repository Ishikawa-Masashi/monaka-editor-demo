const range = document.createRange();

function contains(
  textNode: Text,
  x: number,
  start: number,
  end: number
): boolean {
  range.setStart(textNode, start);
  range.setEnd(textNode, end);

  const rect = range.getBoundingClientRect();
  return rect.left <= x && x < rect.right;
}

export function getLeftToRightHorizontalWritingViewColumn(
  element: Element,
  x: number,
  characterWidth: number
): number {
  //const ELEMENT_NODE = 1;
  const TEXT_NODE = 3;

  x += characterWidth / 2;

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

    if ('data' in textNode) {
    } else {
      console.log('textNode:error');
    }

    const length = textNode.data.length;
    let start = 0;
    let end = length;

    if (contains(textNode, x, start, end)) {
      while (end - start > 1) {
        const mid = Math.floor((end + start) / 2);
        if (contains(textNode, x, start, mid)) {
          end = mid;
        } else if (contains(textNode, x, mid, end)) {
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
