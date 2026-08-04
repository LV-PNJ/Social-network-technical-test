/** Maps fetch/RTK errors to user-facing Spanish messages without leaking internals. */
export function mapAuthError(err: unknown): string {
  const e = err as {
    status?: number | string;
    originalStatus?: number;
    data?: { message?: string; code?: string; statusDescription?: string; error?: string };
    error?: string;
    message?: string;
  };

  const status =
    typeof e?.status === 'number'
      ? e.status
      : typeof e?.originalStatus === 'number'
        ? e.originalStatus
        : undefined;

  if (status === undefined || e?.status === 'FETCH_ERROR' || e?.error === 'TypeError: Failed to fetch') {
    return 'No se pudo contactar Identity. El servicio puede estar caído o en arranque.';
  }
  if (status === 401) {
    return e?.data?.message || 'Credenciales inválidas.';
  }
  if (status === 409) {
    return e?.data?.message || 'El alias o email ya está registrado.';
  }
  if (status === 400) {
    return e?.data?.message || 'Datos de registro inválidos. Revisa el formulario.';
  }
  if (status >= 500) {
    return 'Identity respondió con un error interno. Intenta de nuevo en unos segundos.';
  }

  return (
    e?.data?.message ||
    e?.data?.statusDescription ||
    e?.data?.error ||
    e?.message ||
    'Ocurrió un error inesperado.'
  );
}

export function mapPostsError(err: unknown): string {
  const e = err as { status?: number | string; data?: { message?: string } };
  if (e?.status === 'FETCH_ERROR' || e?.status === undefined) {
    return 'No se pudo contactar el servicio de Posts. El feed está temporalmente no disponible.';
  }
  if (e?.status === 401) {
    return 'Sesión expirada. Vuelve a iniciar sesión.';
  }
  return e?.data?.message || 'No se pudieron cargar las publicaciones.';
}
