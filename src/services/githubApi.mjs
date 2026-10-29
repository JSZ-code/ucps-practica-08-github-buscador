/**
 * Adaptador mínimo de la API pública de GitHub.
 * Se mantiene independiente de React para poder probarlo sin navegador.
 */
export async function obtenerUsuario(nombreUsuario, opciones = {}) {
  const usuario = String(nombreUsuario ?? '').trim();
  if (!usuario) {
    throw new Error('Ingresa un nombre de usuario antes de buscar.');
  }

  const fetchImpl = opciones.fetchImpl ?? globalThis.fetch;
  if (typeof fetchImpl !== 'function') {
    throw new Error('Este entorno no dispone de fetch.');
  }

  const respuesta = await fetchImpl(
    `https://api.github.com/users/${encodeURIComponent(usuario)}`,
    {
      signal: opciones.signal,
      headers: { Accept: 'application/vnd.github+json' },
    },
  );

  // fetch NO rechaza automáticamente por respuestas HTTP 404/403.
  // Se genera el Error aquí para que lo capture el bloque catch de React.
  if (!respuesta.ok) {
    if (respuesta.status === 404) {
      throw new Error(`No se encontró el usuario «${usuario}» en GitHub (404).`);
    }
    if (respuesta.status === 403 || respuesta.status === 429) {
      throw new Error('GitHub ha limitado temporalmente las consultas. Intenta nuevamente más tarde.');
    }
    throw new Error(`No se pudo consultar GitHub (HTTP ${respuesta.status}).`);
  }

  const datos = await respuesta.json();
  if (!datos || typeof datos.login !== 'string' || typeof datos.avatar_url !== 'string') {
    throw new Error('La API devolvió datos incompletos.');
  }

  return {
    nombre: datos.name?.trim() || datos.login,
    login: datos.login,
    biografia: datos.bio?.trim() || 'Sin biografía',
    avatarUrl: datos.avatar_url,
    perfilUrl: datos.html_url || `https://github.com/${encodeURIComponent(datos.login)}`,
  };
}
