import { useEffect } from "react";

const BET_BUTTON_SELECTOR = "[data-smp-spin-button]";

interface UseSpaceKeyForSpinOptions {
  /** When true (jurisdiction `disabledSpacebar`), Space does not start a round. */
  disabled?: boolean;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return Boolean(
    target.closest('input, textarea, select, [contenteditable="true"]'),
  );
}

/**
 * Maps Space to the main Spin action.
 * Skipped when `disabledSpacebar` is set.
 */
export function useSpaceKeyForSpin({
  disabled = false,
}: UseSpaceKeyForSpinOptions) {
  useEffect(() => {
    if (disabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.code !== "Space" && event.key !== " ") return;
      if (isTypingTarget(event.target)) return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;

      const betButton =
        document.querySelector<HTMLButtonElement>(BET_BUTTON_SELECTOR);
      event.preventDefault();
      if (!betButton || betButton.disabled) return;
      betButton.click();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [disabled]);
}
