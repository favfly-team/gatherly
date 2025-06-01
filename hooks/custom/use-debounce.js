import { useRef } from "react";

const useDebounce = (callback, delay) => {
  const timerRef = useRef(null);

  const debouncedCallback = (...args) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedCallback;
};

export { useDebounce };
