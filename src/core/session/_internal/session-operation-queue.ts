let operationQueue: Promise<void> = Promise.resolve();

export function enqueueSessionOperation<TResult>(
  operation: () => Promise<TResult>,
): Promise<TResult> {
  const result = operationQueue.then(operation, operation);

  operationQueue = result.then(
    () => undefined,
    () => undefined,
  );

  return result;
}
