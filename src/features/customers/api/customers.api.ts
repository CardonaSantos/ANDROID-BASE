import { AppError } from "@/core/errors";
import { httpClient } from "@/core/http";

import {
  customerProfileSchema,
  type CustomerProfile,
} from "./customers.contracts.api";

function assertPositiveInteger(value: number, field: string) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new AppError({
      kind: "bad_request",
      source: "application",
      code: "CUSTOMERS_INVALID_ID",
      message: `El identificador ${field} no es válido.`,
    });
  }
}

export async function getCustomerProfile(
  customerId: number,
  signal?: AbortSignal,
): Promise<CustomerProfile> {
  assertPositiveInteger(customerId, "customerId");

  const payload = await httpClient.request<unknown>({
    method: "GET",
    path: `internet-customer/get-customer-details/${customerId}`,
    auth: "auto",
    signal,
  });

  const result = customerProfileSchema.safeParse(payload);

  if (!result.success) {
    throw new AppError({
      kind: "server",
      source: "application",
      code: "CUSTOMER_PROFILE_INVALID_RESPONSE",
      message: "El servidor devolvió un perfil de cliente inválido.",
      details: result.error.issues,
    });
  }

  return result.data;
}
