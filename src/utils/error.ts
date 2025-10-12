export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'error could not be parsed';
}

type ErrorWithMessage = {
  message: string;
};

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}

export function getErrorWithStack(error: unknown) {
  const isError = error instanceof Error;

  if (isError) return { name: error.name, message: error.message, stack: error.stack };

  return { message: getErrorMessage(error) };
}

type Result<T> = [Error, null] | [null, T];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function errorifyAsyncFn<F extends (...args: any[]) => Promise<any>>(
  fn: F,
): (...args: Parameters<F>) => Promise<Result<Awaited<ReturnType<F>>>> {
  return async (...args: Parameters<F>) => {
    try {
      const value = await fn(...args);
      return [null, value];
    } catch (error) {
      if (error instanceof Error) {
        return [error, null];
      }
      return [new Error(getErrorMessage(error)), null];
    }
  };
}
