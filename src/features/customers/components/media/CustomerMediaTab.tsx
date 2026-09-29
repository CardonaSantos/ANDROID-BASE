import { Images } from "lucide-react-native";

import type { CustomerProfile } from "../../api/customers.contracts.api";
import { CustomerSectionCard } from "../shared/CustomerSectionCard";
import { CustomerMediaGallery } from "./CustomerMediaGallery";

export interface CustomerMediaTabProps {
  customer: CustomerProfile;
}

export function CustomerMediaTab({ customer }: CustomerMediaTabProps) {
  const validImages = customer.imagenes.filter(
    (image) => image.cdnUrl.trim().length > 0,
  );

  return (
    <CustomerSectionCard
      title="Media"
      icon={Images}
      description={`${validImages.length} imagen${
        validImages.length === 1 ? "" : "es"
      }`}
    >
      <CustomerMediaGallery images={validImages} />
    </CustomerSectionCard>
  );
}
