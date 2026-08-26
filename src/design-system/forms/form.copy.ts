/**
 * Default NOVA form copy.
 *
 * Keep user-facing defaults centralized. A future localization provider can
 * replace these values without changing individual component implementations.
 */
export const formCopy = {
  password: {
    show: 'Mostrar contraseña',
    hide: 'Ocultar contraseña',
  },

  search: {
    clear: 'Limpiar búsqueda',
  },

  select: {
    placeholder: 'Seleccionar',
    selected: (label: string) =>
      `Seleccionado: ${label}`,
  },

  date: {
    placeholder: 'AAAA-MM-DD',
    invalid:
      'Fecha inválida. Use AAAA-MM-DD.',
  },

  time: {
    placeholder: 'HH:mm',
    invalid:
      'Hora inválida. Use HH:mm.',
  },
} as const;
