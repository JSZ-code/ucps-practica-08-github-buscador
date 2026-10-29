import { useEffect, useRef, useState } from 'react';
import TarjetaUsuario from './TarjetaUsuario.jsx';
import { obtenerUsuario } from '../services/githubApi.mjs';

export default function BuscadorGitHub() {
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [usuario, setUsuario] = useState(null);
  const peticionActual = useRef(null);

  useEffect(() => {
    // Si se abandona la pantalla, se cancela cualquier solicitud pendiente.
    return () => peticionActual.current?.abort();
  }, []);

  async function manejarBusqueda(evento) {
    evento.preventDefault(); // Requisito: evitar recarga nativa del navegador.
    const nombre = busqueda.trim();

    peticionActual.current?.abort();
    peticionActual.current = null;
    setUsuario(null);
    setError('');

    // Requisito: NO efectuar solicitudes HTTP para valores vacíos o espacios.
    if (!nombre) {
      setCargando(false);
      setError('Escribe un nombre de usuario válido para comenzar.');
      return;
    }

    const controlador = new AbortController();
    peticionActual.current = controlador;
    setCargando(true);

    try {
      const perfil = await obtenerUsuario(nombre, { signal: controlador.signal });
      if (peticionActual.current === controlador) {
        setUsuario(perfil);
      }
    } catch (excepcion) {
      if (excepcion.name === 'AbortError') return;
      if (peticionActual.current === controlador) {
        setError(excepcion.message || 'Ocurrió un error al realizar la búsqueda.');
      }
    } finally {
      if (peticionActual.current === controlador) {
        setCargando(false);
      }
    }
  }

  return (
    <section className="search-panel" aria-label="Buscador de GitHub">
      <form className="search-form" onSubmit={manejarBusqueda}>
        <label htmlFor="usuario-github" className="input-label">NOMBRE DE USUARIO DE GITHUB</label>
        <div className="input-row">
          <div className="input-wrap">
            <span className="input-at" aria-hidden="true">@</span>
            <input
              id="usuario-github"
              name="usuario"
              type="text"
              placeholder="Ej. octocat"
              autoComplete="off"
              spellCheck="false"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </div>
          <button type="submit" className="search-button" disabled={cargando}>
            {cargando ? 'Buscando…' : 'Buscar perfil'}
            {!cargando && <span aria-hidden="true">↗</span>}
          </button>
        </div>
        <p className="field-help">Prueba con <button type="button" className="text-button" onClick={() => setBusqueda('octocat')}>@octocat</button> o escribe cualquier alias público.</p>
      </form>

      <div className="results-area" aria-live="polite" aria-atomic="true">
        {cargando && (
          <div className="message-box loading" role="status">
            <span className="loader" aria-hidden="true" /> Buscando en GitHub...
          </div>
        )}
        {!cargando && error && (
          <div className="message-box error" role="alert">
            <span aria-hidden="true">!</span> {error}
          </div>
        )}
        {!cargando && !error && usuario && <TarjetaUsuario {...usuario} />}
        {!cargando && !error && !usuario && (
          <div className="empty-state">
            <span className="empty-orbit" aria-hidden="true">⌕</span>
            <p>Tu próxima búsqueda comienza aquí.</p>
            <span>Introduzca un nombre de usuario para visualizar su perfil.</span>
          </div>
        )}
      </div>
      <div className="disclaimer">Solo se consultan datos públicos de GitHub. No se almacenan perfiles ni contraseñas.</div>
    </section>
  );
}
