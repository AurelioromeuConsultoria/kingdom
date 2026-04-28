import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import '../../components/MemberArea/MemberAreaLayout.css'
import API_CONFIG from '../../services/api.config'
import './member-area.css'

function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({
    email: '',
    senha: '',
    tenantSlug: API_CONFIG.portalTenantSlug || ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/area-do-membro" replace />
  }

  const from = location.state?.from || '/area-do-membro'

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await login(form.email, form.senha, form.tenantSlug || undefined)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err?.response?.data || 'Nao foi possivel entrar agora. Confira seus dados e tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="member-shell">
      <div className="container">
        <div className="member-hero">
          <div className="member-hero__content">
            <div>
              <span className="member-hero__eyebrow">Portal autenticado</span>
              <h1>Sua area do membro dentro do Portal</h1>
              <p>
                Acompanhe escalas, notificacoes, eventos e suas configuracoes pessoais sem sair do site da igreja.
              </p>
            </div>
          </div>
        </div>

        <div className="member-card-grid member-card-grid--two">
          <div className="member-panel">
            <div className="member-panel__header">
              <div>
                <h2>Entrar</h2>
                <p>Use o mesmo acesso do sistema para abrir sua area autenticada.</p>
              </div>
            </div>

            {error ? <div className="member-feedback member-feedback--error">{error}</div> : null}

            <form onSubmit={handleSubmit}>
              <div className="member-form-grid">
                <div className="member-field">
                  <label htmlFor="email">Email de login</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="voce@igreja.com"
                    required
                  />
                </div>

                <div className="member-field">
                  <label htmlFor="senha">Senha</label>
                  <input
                    id="senha"
                    name="senha"
                    type="password"
                    value={form.senha}
                    onChange={handleChange}
                    placeholder="Sua senha"
                    required
                  />
                </div>

                <div className="member-field">
                  <small>
                    Este acesso usa automaticamente o contexto da igreja exibida no Portal.
                  </small>
                </div>
              </div>

              <div className="member-inline-actions">
                <button type="submit" className="member-action-button" disabled={submitting}>
                  {submitting ? 'Entrando...' : 'Entrar na area do membro'}
                </button>
                <Link to="/cadastro" className="member-action-button--ghost">
                  Ainda nao tenho cadastro
                </Link>
              </div>
            </form>
          </div>

          <div className="member-panel">
            <div className="member-panel__header">
              <div>
                <h2>O que voce encontra aqui</h2>
                <p>Esta primeira versao nasce dentro do Portal e pode crescer junto com o restante do sistema.</p>
              </div>
            </div>

            <div className="member-card-grid">
              <div className="member-highlight-card">
                <h3>Minhas escalas</h3>
                <p>Confirme, recuse e acompanhe suas proximas participacoes.</p>
              </div>
              <div className="member-highlight-card">
                <h3>Notificacoes</h3>
                <p>Receba avisos da equipe, trocas e comunicados importantes.</p>
              </div>
              <div className="member-highlight-card">
                <h3>Meu perfil</h3>
                <p>Consulte seus dados, altere sua senha e ajuste preferencias de comunicacao.</p>
              </div>
              <div className="member-highlight-card">
                <h3>Eventos</h3>
                <p>Veja os proximos encontros e acompanhe a evolucao dessa experiencia no Portal.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
