import type { TicketSignatureUploadFile } from "../../api/ticket-conformity.api";

export interface TicketSignaturePadCaptureOptions {
  fileName?: string;
}

export interface TicketSignaturePadHandle {
  clear: () => void;
  isEmpty: () => boolean;
  captureFile: (
    options?: TicketSignaturePadCaptureOptions,
  ) => Promise<TicketSignatureUploadFile | null>;
}

export interface TicketSignaturePadProps {
  disabled?: boolean;
  invalid?: boolean;
  error?: string;
  description?: string;
  onEmptyChange?: (isEmpty: boolean) => void;
}
