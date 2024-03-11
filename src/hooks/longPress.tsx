import React, { useState, useEffect, useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const useLongPress = <T extends (...args: any[]) => any>(callback: T = (() => {}) as T, ms = 500) => {
  const [startLongPress, setStartLongPress] = useState(false);
  const timeout = React.useRef<NodeJS.Timeout>();

  const start = useCallback(
    (event) => {
      event.stopPropagation();
      timeout.current = setTimeout(callback, ms) as unknown as NodeJS.Timeout;
      setStartLongPress(true);
    },
    [callback, ms]
  );

  const stop = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    setStartLongPress(false);
  }, []);

  useEffect(() => {
    if (startLongPress) {
      window.addEventListener('mouseup', stop);
      window.addEventListener('touchend', stop);
    } else {
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchend', stop);
    }

    return () => {
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchend', stop);
    };
  }, [stop, startLongPress]);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: stop,
    onTouchEnd: stop,
    onMouseLeave: stop,
  };
};
