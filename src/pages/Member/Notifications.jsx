import { useEffect, useState } from 'react'
import MemberAreaLayout from '../../components/MemberArea/MemberAreaLayout'
import apiService from '../../services/api.service'
import './member-area.css'

function Notifications() {
  const [notificacoes, setNotificacoes] = useState([])
  const [loading, setLoading] = useState(true)

  const loadNotificacoes = async () => {
    const data = await apiService.getMinhasNotificacoes().catch(() => [])
    setNotificacoes(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    let active = true

    async function bootstrap() {
      try {
        const data = await apiService.getMinhasNotificacoes().catch(() => [])
        if (!active) return
        setNotificacoes(Array.isArray(data) ? data : [])
      } finally {
        if (active) setLoading(false)
      }
    }

    bootstrap()
    return () => { active = false }
  }, [])

  const handleMarkRead = async (id) => {
    await apiService.marcarNotificacaoComoLida(id)
    await loadNotificacoes()
  }

  const handleMarkAllRead = async () => {
    await apiService.marcarTodasNotificacoesComoLidas()
    await loadNotificacoes()
  }

  return (
    <MemberAreaLayout
      title="Notificacoes"
      description="A central de notificacoes da area do membro concentra o que exige sua atencao sem misturar com o admin."
      actions={
        notificacoes.some((item) => !item.lida) ? (
          <button type="button" className="member-action-button--ghost" onClick={handleMarkAllRead}>
            Marcar todas como lidas
          </button>
        ) : null
      }
    >
      {loading ? (
        <div className="member-state-card">
          <h2>Carregando notificacoes</h2>
          <p>Buscando avisos internos vinculados a sua conta.</p>
        </div>
      ) : notificacoes.length === 0 ? (
        <div className="member-state-card">
          <h2>Nenhuma notificacao</h2>
          <p>Quando surgirem comunicados internos, eles ficarao organizados aqui.</p>
        </div>
      ) : (
        <div className="member-list">
          {notificacoes.map((notificacao) => (
            <div className="member-panel" key={notificacao.id}>
              <div className="member-panel__header">
                <div>
                  <h2>{notificacao.titulo}</h2>
                  <p>{new Date(notificacao.dataCriacao).toLocaleString('pt-BR')}</p>
                </div>
                <span className={`member-badge ${notificacao.lida ? 'member-badge--neutral' : 'member-badge--pending'}`}>
                  {notificacao.lida ? 'Lida' : 'Nao lida'}
                </span>
              </div>
              <p>{notificacao.mensagem}</p>
              {!notificacao.lida ? (
                <div className="member-inline-actions">
                  <button type="button" className="member-action-button--ghost" onClick={() => handleMarkRead(notificacao.id)}>
                    Marcar como lida
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </MemberAreaLayout>
  )
}

export default Notifications
