export { AppError } from "./AppError";

export {
  hasAppErrorCode,
  isAppError,
  isAppErrorKind,
  isAppErrorSource,
} from "./app-error.guards";

export { toAppError } from "./app-error.utils";

export type {
  AppErrorKind,
  AppErrorOptions,
  AppErrorSource,
  ToAppErrorOptions,
} from "./app-error.types";
