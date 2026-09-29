import { useQuery } from "@tanstack/react-query";

import { customerProfileQueryOptions } from "../application/customers.query";

export function useCustomerProfileQuery(customerId: number) {
  return useQuery(customerProfileQueryOptions(customerId));
}
