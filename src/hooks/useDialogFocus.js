import { useEffect, useRef } from "react";
export function useDialogFocus(open, onClose) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const panel = ref.current;
    const selector =
      'button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),[tabindex="0"]';
    Array.from(panel?.querySelectorAll(selector) || [])
      .find((el) => el.getClientRects().length)
      ?.focus();
    function handleKey(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = Array.from(panel?.querySelectorAll(selector) || []).filter(
        (el) => el.getClientRects().length,
      );
      if (!items.length) {
        event.preventDefault();
        return;
      }
      const first = items[0],
        last = items[items.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !panel.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !panel.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previous?.focus();
    };
  }, [open, onClose]);
  return ref;
}
