/** Componente presentacional: recibe datos exclusivamente por props. */
export default function TarjetaUsuario({ nombre, login, biografia, avatarUrl, perfilUrl }) {
  return (
    <article className="user-card" aria-label={`Perfil de ${login}`}>
      <div className="card-topline"><span className="status-dot" /> PERFIL ENCONTRADO</div>
      <img src={avatarUrl} alt={`Avatar público de ${login}`} className="avatar" width="110" height="110" />
      <h2>{nombre}</h2>
      <p className="username">@{login}</p>
      <p className="bio">{biografia}</p>
      <a className="profile-link" href={perfilUrl} target="_blank" rel="noopener noreferrer">
        Ver perfil en GitHub <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}
