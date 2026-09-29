import { Printer, Receipt, RefreshCw } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import {
  AppButton,
  AppErrorState,
  AppIconButton,
  AppScrollScreen,
  AppSnackbar,
  AppStack,
  AppStateView,
  AppText,
  AppTopBar,
} from "@/design-system";

import { printCollectionInvoiceReceipt } from "../application/collection-receipt.print";
import { CollectionReceiptPreview } from "../components/receipt/CollectionReceiptPreview";
import { useCollectionInvoiceReceiptQuery } from "../hooks/collections.hooks";

export interface CollectionReceiptScreenProps {
  invoiceId: number;
  onBack: () => void;
}

export function CollectionReceiptScreen({
  invoiceId,
  onBack,
}: CollectionReceiptScreenProps) {
  const [printing, setPrinting] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: "success" | "danger";
  } | null>(null);

  const hasValidInvoiceId = Number.isInteger(invoiceId) && invoiceId > 0;
  const receiptQuery = useCollectionInvoiceReceiptQuery(invoiceId);

  if (!hasValidInvoiceId) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Comprobante"
          subtitle="Factura inválida"
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppErrorState
            fill
            title="Factura inválida"
            description="El identificador de la factura no es válido."
            primaryAction={{ label: "Volver", onPress: onBack }}
          />
        </View>
      </View>
    );
  }

  if (receiptQuery.isPending) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title={`Factura #${invoiceId}`}
          subtitle="Comprobante"
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppStateView
            fill
            icon={Receipt}
            tone="primary"
            title="Cargando comprobante"
            description="Consultando la factura y su historial de pagos."
            announceOnMount
          />
        </View>
      </View>
    );
  }

  if (receiptQuery.isError || !receiptQuery.data) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title={`Factura #${invoiceId}`}
          subtitle="Comprobante"
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppErrorState
            fill
            title="No se pudo cargar el comprobante"
            description="Revisa tu conexión o intenta consultar nuevamente."
            primaryAction={{
              label: "Reintentar",
              icon: RefreshCw,
              loading: receiptQuery.isRefetching,
              onPress: () => {
                void receiptQuery.refetch();
              },
            }}
            secondaryAction={{ label: "Volver", onPress: onBack }}
          />
        </View>
      </View>
    );
  }

  const receipt = receiptQuery.data;

  const handlePrint = async () => {
    if (printing) {
      return;
    }

    setPrinting(true);

    try {
      await printCollectionInvoiceReceipt(receipt);

      /*
       * En Android expo-print resuelve cuando abre la ventana nativa.
       * No afirmamos que el papel ya fue impreso porque el servicio de
       * impresión todavía puede ser cancelado por el usuario.
       */
      setFeedback({
        message: "Se abrió el sistema de impresión.",
        tone: "success",
      });
    } catch {
      setFeedback({
        message: "No se pudo abrir el sistema de impresión.",
        tone: "danger",
      });
    } finally {
      setPrinting(false);
    }
  };

  return (
    <View style={styles.root}>
      <AppTopBar
        title={`Factura #${receipt.id}`}
        subtitle="Comprobante"
        back
        onBack={onBack}
        safeAreaEdges={[]}
        variant="background"
        divider
        actions={
          <AppIconButton
            icon={RefreshCw}
            size="sm"
            variant="ghost"
            tone="neutral"
            accessibilityLabel="Actualizar comprobante"
            loadingAccessibilityLabel="Actualizando comprobante"
            loading={receiptQuery.isFetching}
            disabled={printing}
            onPress={() => {
              void receiptQuery.refetch();
            }}
          />
        }
      />

      <AppScrollScreen
        safeAreaEdges={[]}
        contentPaddingVertical="md"
        scrollStyle={styles.scroll}
        scrollContentStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppStack gap="md">
          <AppStack gap="xs">
            <AppText variant="headlineSmall" weight="semibold">
              Comprobante de factura
            </AppText>

            <AppText variant="bodySmall" tone="secondary">
              Refleja el historial acumulado de pagos registrado en esta factura.
            </AppText>
          </AppStack>

          <CollectionReceiptPreview receipt={receipt} />

          <AppButton
            size="lg"
            variant="solid"
            tone="primary"
            leadingIcon={Printer}
            fullWidth
            loading={printing}
            disabled={receiptQuery.isFetching}
            loadingAccessibilityLabel="Abriendo sistema de impresión"
            accessibilityLabel="Imprimir comprobante de factura"
            onPress={() => {
              void handlePrint();
            }}
          >
            Imprimir ticket
          </AppButton>

          <AppText variant="caption" tone="muted" align="center">
            La aplicación no fija una impresora específica. Android mostrará los
            servicios de impresión disponibles en el dispositivo.
          </AppText>
        </AppStack>
      </AppScrollScreen>

      <AppSnackbar
        open={feedback !== null}
        onOpenChange={(open) => {
          if (!open) {
            setFeedback(null);
          }
        }}
        message={feedback?.message ?? ""}
        tone={feedback?.tone ?? "success"}
        position="bottom"
      />
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

  stateContainer: {
    flex: 1,
    minHeight: 0,
  },

  scroll: {
    flex: 1,
    minHeight: 0,
  },

  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
}));
