const perf = async (fn) => {
  if (fn.constructor.name === "AsyncFunction") {
    const start = performance.now();
    await fn();
    console.log(`fn DONE in: ${performance.now() - start}ms`);
    return;
  }

  const start = performance.now();
  fn();
  console.log(`fn DONE in: ${performance.now() - start}ms`);
};

export default perf;
