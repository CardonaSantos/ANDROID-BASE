import { Redirect } from "expo-router";

export default function CustomersIndexRoute() {
  /*
   * El módulo móvil expone únicamente detalle de cliente por ahora.
   * Mantenemos /clientes como ruta real para que el Shell pueda resolver
   * correctamente el prefijo sin inventar una lista general todavía.
   */
  return <Redirect href="/" />;
}
