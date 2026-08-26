export const feedbackCopy = {
  loading: {
    label: 'Cargando',
  },

  states: {
    empty: {
      title: 'No hay contenido',
    },

    error: {
      title: 'Ocurrió un error',
      retry: 'Reintentar',
    },

    offline: {
      title: 'Sin conexión',
      description:
        'Comprueba tu conexión a internet e inténtalo de nuevo.',
      retry: 'Reintentar',
    },

    noResults: {
      title: 'Sin resultados',
      description:
        'No encontramos elementos que coincidan con tu búsqueda.',
    },

    permission: {
      title: 'Permiso requerido',
      description:
        'Esta función necesita un permiso adicional para continuar.',
    },
  },

  alert: {
    dismiss: 'Cerrar aviso',
  },

  connectivity: {
    online: 'En línea',
    offline: 'Sin conexión',
    syncing: 'Sincronizando',
    reconnected: 'Conexión restablecida',
    pending: (count: number) =>
      count === 1
        ? '1 cambio pendiente'
        : `${count} cambios pendientes`,
  },
} as const;
