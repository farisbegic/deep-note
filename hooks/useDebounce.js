import { useState, useEffect } from "react";

const useDebounce = (callback, delay) => {
  const [timer, setTimer] = useState(null);

  const debounce = (...args) => {
    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimer(newTimer);
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  return debounce;
};

export default useDebounce;
