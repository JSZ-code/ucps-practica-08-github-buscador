import BuscadorGitHub from './components/BuscadorGitHub.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar container">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">{'{ }'}</span>
          <span>UCPS <span className="brand-separator">/</span> Desarrollo de aplicaciones empresariales</span>
        </div>
        <span className="practice-tag">PRÁCTICA 08</span>
      </header>

      <main className="container main-content">
        <section className="hero" aria-labelledby="titulo">
          <div className="eyebrow"><span className="dot" /> EXPLORADOR DE PERFILES PÚBLICOS</div>
          <h1 id="titulo">Descubre el talento <span className="accent">detrás del código.</span></h1>
          <p className="subtitle">Busca cualquier usuario de GitHub y consulta su información pública en tiempo real mediante la API REST.</p>
        </section>

        <BuscadorGitHub />

        <footer className="site-footer">
          <span>UNSA · UCPS · Práctica 8</span>
          <span>React + Vite + GitHub REST API</span>
        </footer>
      </main>
    </div>
  );
}
