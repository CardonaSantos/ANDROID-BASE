import {
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";

import {
  AppAlert,
  AppStack,
} from "@/design-system";

import type {
  TicketSignaturePadHandle,
  TicketSignaturePadProps,
} from "./TicketSignaturePad.types";

/*
 * Fallback Web deliberado.
 *
 * Esta entrega está orientada a la APP nativa. Mantener un fallback evita que
 * Expo Web falle al resolver el módulo mientras no duplicamos otra vez el
 * canvas + signature_pad que ya existe en el CRM Web.
 */
export const TicketSignaturePad = forwardRef<
  TicketSignaturePadHandle,
  TicketSignaturePadProps
>(function TicketSignaturePad({ onEmptyChange }, ref) {
  useEffect(() => {
    onEmptyChange?.(true);
  }, [onEmptyChange]);

  useImperativeHandle(ref, () => ({
    clear: () => undefined,
    isEmpty: () => true,
    captureFile: async () => null,
  }));

  return (
    <AppStack gap="sm">
      <AppAlert tone="info" title="Firma disponible en la aplicación móvil">
        Esta superficie de firma está preparada para Android/iOS. El CRM Web
        conserva su implementación propia basada en canvas.
      </AppAlert>
    </AppStack>
  );
});

TicketSignaturePad.displayName = "TicketSignaturePad";
