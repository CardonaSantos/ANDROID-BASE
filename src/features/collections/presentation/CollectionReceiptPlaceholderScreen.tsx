import { ArrowLeft, Printer } from "lucide-react-native";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import {
  AppButton,
  AppCard,
  AppIcon,
  AppScrollScreen,
  AppStack,
  AppText,
  AppTopBar,
} from "@/design-system";

export interface CollectionReceiptPlaceholderScreenProps {
  invoiceId: number;
  onBack: () => void;
}

export function CollectionReceiptPlaceholderScreen({
  invoiceId,
  onBack,
}: CollectionReceiptPlaceholderScreenProps) {
  return (
    <View style={styles.root}>
      <AppTopBar
        title="Comprobante de pago"
        subtitle={invoiceId > 0 ? `Factura #${invoiceId}` : "Factura"}
        back
        onBack={onBack}
        safeAreaEdges={[]}
        variant="background"
        divider
      />

      <AppScrollScreen
        safeAreaEdges={[]}
        contentPaddingVertical="lg"
        showsVerticalScrollIndicator={false}
      >
        <AppCard variant="outlined" radius="lg" padding="lg">
          <AppStack gap="lg">
            <AppIcon icon={Printer} size="lg" tone="primary" decorative />

            <AppStack gap="sm">
              <AppText variant="titleLarge" weight="semibold">
                Impresión pendiente de implementar
              </AppText>

              <AppText variant="bodyMedium" tone="secondary">
                La navegación al comprobante ya está reservada. En una siguiente
                fase esta pantalla podrá consultar la factura y generar, abrir o
                imprimir el comprobante real sin modificar el flujo de cobro.
              </AppText>
            </AppStack>

            {invoiceId > 0 ? (
              <AppText variant="bodyMedium" weight="semibold">
                {`Factura #${invoiceId}`}
              </AppText>
            ) : null}

            <AppButton
              variant="outlined"
              tone="neutral"
              leadingIcon={ArrowLeft}
              onPress={onBack}
            >
              Volver a la ruta
            </AppButton>
          </AppStack>
        </AppCard>
      </AppScrollScreen>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    backgroundColor: theme.colors.background,
  },
}));
