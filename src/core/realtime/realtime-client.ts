import { appConfig } from "@/core/config";

import { sessionTokenProvider } from "@/core/session";

import { createRealtimeManager } from "./realtime.manager";

/*
 * =========================================================
 * APPLICATION REALTIME CLIENT
 * =========================================================
 *
 * El manager abstrae Socket.IO del resto de la aplicación.
 *
 * Los consumidores continúan utilizando:
 *
 * realtimeClient.subscribe(...)
 * realtimeClient.send(...)
 * realtimeClient.resume()
 * realtimeClient.suspend(...)
 * realtimeClient.reconnect()
 *
 * sin importar qué transporte existe debajo.
 * =========================================================
 */

export const realtimeClient = createRealtimeManager({
  /*
   * HTTP(S) origin del servidor.
   *
   * Ejemplo:
   *
   * https://api.example.com
   *
   * realtime.manager configura:
   *
   * namespace: /ws
   * path:      /socket.io
   */
  url: appConfig.realtime.url,

  /*
   * Conservamos el nombre histórico del modo porque
   * forma parte de nuestra abstracción.
   *
   * En Socket.IO el token se envía realmente mediante:
   *
   * handshake.auth.token
   *
   * y CrmGateway lo verifica del lado servidor.
   */
  authMode: "bearer-header",

  tokenProvider: sessionTokenProvider,
});
