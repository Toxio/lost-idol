import { useCallback, useEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';

/** iOS Safari may emit a trailing click on the opener after the backdrop mounts. */
const IOS_DISMISS_GUARD_MS = 400;

/**
 * Backdrop dismiss handler safe for touch devices.
 * Uses click (not mousedown) and ignores dismiss briefly after mount/open.
 */
export function useBackdropDismiss(onClose: () => void, active = true) {
  const suppressDismissRef = useRef(true);

  useEffect(() => {
    if (!active) return;

    suppressDismissRef.current = true;
    const timer = window.setTimeout(() => {
      suppressDismissRef.current = false;
    }, IOS_DISMISS_GUARD_MS);

    return () => window.clearTimeout(timer);
  }, [active]);

  const onBackdropClick = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      if (event.target !== event.currentTarget) return;
      if (suppressDismissRef.current) return;
      onClose();
    },
    [onClose],
  );

  const stopDialogPropagation = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    event.stopPropagation();
  }, []);

  return { onBackdropClick, stopDialogPropagation };
}
