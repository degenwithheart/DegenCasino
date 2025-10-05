import React from 'react';

export default function useOnClickOutside(
  ref: React.RefObject<HTMLDivElement>,
  handler: (event: TouchEvent | MouseEvent) => void,
) {
  React.useEffect(() => {
    const listener = (event: TouchEvent | MouseEvent) => {
      // Event parameter is used by handler but not directly in this function
      void event;
      if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
