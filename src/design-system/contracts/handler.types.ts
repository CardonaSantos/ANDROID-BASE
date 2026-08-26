export type MaybePromise<T> = T | Promise<T>;

export type AsyncActionHandler<
  TArgs extends unknown[] = [],
  TResult = void,
> = (...args: TArgs) => MaybePromise<TResult>;

export type ValueChangeHandler<T> = (
  value: T,
) => void;

export type OpenChangeHandler = ValueChangeHandler<boolean>;

export type ActionExecutionResult<TResult> =
  | {
      status: 'success';
      data: TResult;
    }
  | {
      status: 'error';
      error: unknown;
    }
  | {
      status: 'ignored';
    };
