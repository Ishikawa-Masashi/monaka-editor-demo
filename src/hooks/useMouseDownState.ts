import * as React from 'react';
import { MouseDownState } from '../utilities';
import { useConst } from '../hooks';
import { useEditorViewContext } from '../contexts/EditorViewContext';

export function useMouseDownState() {
  const { setSelectionStart } = useEditorViewContext();

  const mouseDownState = useConst(() => new MouseDownState());

  const onMouseDown = React.useCallback(
    (evt: MouseEvent) => {
      const { clientX, clientY, button } = evt;
      mouseDownState.setStartButtons({ leftButton: button === 0 });
      mouseDownState.setPosition({ x: clientX, y: clientY });
    },
    [mouseDownState]
  );

  const onMouseMove = React.useCallback(
    (evt: MouseEvent) => {
      const { clientX, clientY } = evt;
      const position = { x: clientX, y: clientY };
      mouseDownState.setPosition(position);
    },
    [mouseDownState]
  );

  const onMouseUp = React.useCallback(
    (evt: MouseEvent) => {
      const { button } = evt;
      // console.log(`mouseup:${!(button === 0)}`);
      setSelectionStart(undefined);
      mouseDownState.setStartButtons({ leftButton: !(button === 0) });
    },
    [mouseDownState]
  );

  React.useEffect(() => {
    window.addEventListener('mousedown', onMouseDown, { capture: true });
    return () => {
      window.removeEventListener('mousedown', onMouseDown, { capture: true });
    };
  }, [onMouseDown]);

  React.useEffect(() => {
    window.addEventListener('mousemove', onMouseMove, { capture: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove, { capture: true });
    };
  }, [onMouseMove]);

  React.useEffect(() => {
    window.addEventListener('mouseup', onMouseUp, { capture: true });
    return () => {
      window.removeEventListener('mouseup', onMouseUp, { capture: true });
    };
  }, [onMouseUp]);

  return {
    mouseDownState,
  };
}
