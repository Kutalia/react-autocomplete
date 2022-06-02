export const debounce = (func: (...params: any[]) => void, timeout: number) => {
  let inQueue = true;
  let timeoutId: any;

  const debouncedFunc: typeof func = (...params) => {
    inQueue = true;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...params);
      inQueue = false;
    }, timeout);
  };

  return debouncedFunc;
};
