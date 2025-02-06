type ExecutionTimeResult<T> = {
  result: T;
  executionTime: number;
};

export const measureExecutionTime = <T>(
  operation: () => T
): ExecutionTimeResult<T> => {
  const startTime = performance.now();
  const result = operation();
  const endTime = performance.now();
  return {
    result,
    executionTime: endTime - startTime,
  };
};
