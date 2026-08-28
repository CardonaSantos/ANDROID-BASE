import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { StyleSheet } from "react-native-unistyles";

import { isAppError } from "@/core/errors";

import {
  AppAlert,
  AppButton,
  AppFormField,
  AppInput,
  AppKeyboardScreen,
  AppPasswordInput,
  AppStack,
  AppText,
} from "@/design-system";

import { loginCredentialsSchema, type LoginCredentials } from "../api";
import { useLoginMutation } from "../hook";

function getLoginErrorMessage(error: unknown): string {
  if (!isAppError(error)) {
    return "No se pudo iniciar sesión.";
  }

  switch (error.kind) {
    case "unauthorized":
      return "Correo o contraseña incorrectos.";

    case "network":
      return "No se pudo conectar con el servidor.";

    case "timeout":
      return "El servidor tardó demasiado en responder.";

    case "server":
      return "El servidor no pudo procesar el inicio de sesión.";

    default:
      return "No se pudo iniciar sesión. Inténtalo nuevamente.";
  }
}

export function LoginForm() {
  const loginMutation = useLoginMutation();

  const { control, handleSubmit } = useForm<LoginCredentials>({
    resolver: zodResolver(loginCredentialsSchema),

    defaultValues: {
      correo: "",
      contrasena: "",
    },

    mode: "onTouched",
  });

  const submit = handleSubmit((values) => {
    loginMutation.mutate(values);
  });

  const clearRequestError = () => {
    if (loginMutation.isError) {
      loginMutation.reset();
    }
  };

  return (
    <AppKeyboardScreen contentStyle={styles.screenContent}>
      <AppStack gap="xl" style={styles.form}>
        <AppStack gap="xs">
          <AppText variant="headlineSmall" weight="semibold">
            Iniciar sesión
          </AppText>

          <AppText tone="muted">Ingresa tus credenciales para acceder.</AppText>
        </AppStack>

        {loginMutation.isError ? (
          <AppAlert
            tone="danger"
            title="No se pudo iniciar sesión"
            announceOnMount
          >
            {getLoginErrorMessage(loginMutation.error)}
          </AppAlert>
        ) : null}

        <AppStack gap="lg">
          <AppFormField control={control} name="correo">
            {({ field, errorMessage }) => (
              <AppInput
                ref={field.ref}
                label="Correo electrónico"
                placeholder="correo@ejemplo.com"
                value={field.value}
                error={errorMessage}
                required
                disabled={loginMutation.isPending}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                onBlur={field.onBlur}
                onChangeText={(value) => {
                  clearRequestError();

                  field.onChange(value);
                }}
              />
            )}
          </AppFormField>

          <AppFormField control={control} name="contrasena">
            {({ field, errorMessage }) => (
              <AppPasswordInput
                ref={field.ref}
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                value={field.value}
                error={errorMessage}
                required
                disabled={loginMutation.isPending}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="done"
                onBlur={field.onBlur}
                onChangeText={(value) => {
                  clearRequestError();

                  field.onChange(value);
                }}
                onSubmitEditing={() => {
                  void submit();
                }}
              />
            )}
          </AppFormField>

          <AppButton
            fullWidth
            size="lg"
            loading={loginMutation.isPending}
            loadingAccessibilityLabel="Iniciando sesión"
            onPress={() => {
              void submit();
            }}
          >
            Iniciar sesión
          </AppButton>
        </AppStack>
      </AppStack>
    </AppKeyboardScreen>
  );
}

const styles = StyleSheet.create(() => ({
  screenContent: {
    justifyContent: "center",
  },

  form: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
}));
