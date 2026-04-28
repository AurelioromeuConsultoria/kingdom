import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './MemberAreaLayout.css'

function MemberAreaLayout({ title, description, actions, children }) {
  const { user, logout } = useAuth()

  return (
    <div className="member-shell">
      <section className="member-hero">
        <div className="container">
          <div className="member-hero__content">
            <div>
              <span className="member-hero__eyebrow">Area do membro</span>
              <h1>{title}</h1>
              {description ? <p>{description}</p> : null}
            </div>
            <div className="member-hero__meta">
              <div className="member-pill">
                <span>{user?.nome || 'Membro'}</span>
                <small>{user?.emailLogin || user?.email || 'Conta autenticada'}</small>
              </div>
              {actions ? <div className="member-hero__actions">{actions}</div> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="member-body">
        <div className="container member-grid">
          <aside className="member-sidebar">
            <div className="member-sidebar__card">
              <div className="member-sidebar__identity">
                <div className="member-avatar">
                  {(user?.nome || 'M').trim().charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2>{user?.nome || 'Membro'}</h2>
                  <p>{user?.perfilAcessoNome || user?.tipoUsuarioDescricao || 'Conta ativa'}</p>
                </div>
              </div>

              <nav className="member-nav">
                <NavLink end to="/area-do-membro" className="member-nav__link">
                  Inicio
                </NavLink>
                <NavLink to="/area-do-membro/perfil" className="member-nav__link">
                  Meu perfil
                </NavLink>
                <NavLink to="/area-do-membro/escalas" className="member-nav__link">
                  Minhas escalas
                </NavLink>
                <NavLink to="/area-do-membro/eventos" className="member-nav__link">
                  Eventos
                </NavLink>
                <NavLink to="/area-do-membro/notificacoes" className="member-nav__link">
                  Notificacoes
                </NavLink>
                <NavLink to="/area-do-membro/familia" className="member-nav__link">
                  Minha familia
                </NavLink>
                <NavLink to="/area-do-membro/oracao" className="member-nav__link">
                  Pedidos de oracao
                </NavLink>
              </nav>

              <button type="button" className="member-logout-button" onClick={logout}>
                Sair da area do membro
              </button>
            </div>
          </aside>

          <div className="member-content">
            {children}
          </div>
        </div>
      </section>
    </div>
  )
}

export default MemberAreaLayout
