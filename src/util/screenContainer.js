const debounce = (delay, callback, ...args) => {
  let task;
  return function () {
    clearTimeout(task);
    task = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
};
export default debounce;
