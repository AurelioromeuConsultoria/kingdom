import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MemberAreaLayout from '../../components/MemberArea/MemberAreaLayout'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/api.service'
import './member-area.css'

function getInscricaoBadge(status) {
  if (status === 2 || status === 'Confirmada') {
    return { label: 'Confirmada', className: 'member-badge--confirmed' }
  }
  if (status === 3 || status === 'Cancelada') {
    return { label: 'Cancelada', className: 'member-badge--refused' }
  }
  if (status === 4 || status === 'Presente') {
    return { label: 'Presente', className: 'member-badge--served' }
  }
  return { label: 'Pendente', className: 'member-badge--pending' }
}

function Events() {
  const { user } = useAuth()
  const [eventos, setEventos] = useState([])
  const [inscricoes, setInscricoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingEventId, setSavingEventId] = useState(null)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const loadPage = async () => {
    const [eventosData, inscricoesData] = await Promise.all([
      apiService.getUpcomingEvents(8).catch(() => []),
      apiService.getMinhasInscricoesEventos().catch(() => [])
    ])
    setEventos(Array.isArray(eventosData) ? eventosData : [])
    setInscricoes(Array.isArray(inscricoesData) ? inscricoesData : [])
  }

  useEffect(() => {
    let active = true

    async function bootstrap() {
      try {
        const [eventosData, inscricoesData] = await Promise.all([
          apiService.getUpcomingEvents(8).catch(() => []),
          apiService.getMinhasInscricoesEventos().catch(() => [])
        ])
        if (!active) return
        setEventos(Array.isArray(eventosData) ? eventosData : [])
        setInscricoes(Array.isArray(inscricoesData) ? inscricoesData : [])
      } finally {
        if (active) setLoading(false)
      }
    }

    bootstrap()
    return () => { active = false }
  }, [])

  const stats = useMemo(() => ({
    inscricoes: inscricoes.length,
    confirmadas: inscricoes.filter((item) => getInscricaoBadge(item.status).label === 'Confirmada').length,
    pendentes: inscricoes.filter((item) => getInscricaoBadge(item.status).label === 'Pendente').length,
    proximosComInscricao: eventos.filter((evento) => evento.aceitaInscricoes || evento.AceitaInscricoes).length
  }), [eventos, inscricoes])

  const eventoIdsInscritos = useMemo(
    () => new Set(inscricoes.map((item) => item.eventoId)),
    [inscricoes]
  )

  const handleInscricaoRapida = async (evento) => {
    setSavingEventId(evento.id)
    setFeedback({ type: '', message: '' })

    try {
      const whatsApp = (user?.whatsApp || user?.telefone || '').toString().replace(/\D/g, '')
      if (!user?.nome || !whatsApp) {
        throw new Error('missing_profile_data')
      }

      await apiService.createInscricaoEvento({
        eventoId: evento.id,
        nome: user?.nome || '',
        whatsApp,
        email: user?.emailLogin || user?.email || null,
        observacoes: 'Inscricao iniciada pela area do membro.'
      })
      await loadPage()
      setFeedback({ type: 'success', message: `Sua inscricao em "${evento.titulo || evento.nome}" foi registrada.` })
    } catch {
      setFeedback({ type: 'error', message: 'Nao foi possivel concluir a inscricao rapida agora. Confirme se seu nome e WhatsApp estao preenchidos no perfil ou tente pelo detalhe do evento.' })
    } finally {
      setSavingEventId(null)
    }
  }

  return (
    <MemberAreaLayout
      title="Eventos"
      description="Aqui a agenda deixa de ser so consulta. Voce acompanha suas inscricoes, enxerga o que esta aberto e ja resolve sua participacao sem sair da area logada."
    >
      <div className="member-kpis">
        <div className="member-kpi">
          <span>Minhas inscricoes</span>
          <strong>{stats.inscricoes}</strong>
          <small>Eventos vinculados a sua conta</small>
        </div>
        <div className="member-kpi">
          <span>Confirmadas</span>
          <strong>{stats.confirmadas}</strong>
          <small>Participacoes com presenca ou aprovacao</small>
        </div>
        <div className="member-kpi">
          <span>Pendentes</span>
          <strong>{stats.pendentes}</strong>
          <small>Inscricoes aguardando movimentacao</small>
        </div>
        <div className="member-kpi">
          <span>Agenda aberta</span>
          <strong>{stats.proximosComInscricao}</strong>
          <small>Eventos que aceitam inscricao agora</small>
        </div>
      </div>

      {feedback.message ? (
        <div className={`member-feedback ${feedback.type === 'error' ? 'member-feedback--error' : 'member-feedback--success'}`}>
          {feedback.message}
        </div>
      ) : null}

      <div className="member-panel">
        <div className="member-panel__header">
          <div>
            <h2>Minhas inscricoes</h2>
            <p>Esse bloco ja puxa suas inscricoes reais a partir da conta autenticada.</p>
          </div>
        </div>

        {inscricoes.length === 0 ? (
          <div className="member-state-card">
            <h2>Nenhuma inscricao encontrada</h2>
            <p>Quando voce se inscrever em um evento usando o mesmo e-mail da sua conta, ele aparece aqui.</p>
          </div>
        ) : (
          <div className="member-list">
            {inscricoes.map((inscricao) => {
              const badge = getInscricaoBadge(inscricao.status)
              return (
                <div className="member-panel member-event-card member-event-card--soft" key={inscricao.id}>
                  <div>
                    <h2>{inscricao.eventoTitulo || 'Evento'}</h2>
                    <p>{inscricao.observacoes || 'Inscricao registrada na sua conta.'}</p>
                    <div className="member-highlight-card__meta">
                      <span className={`member-badge ${badge.className}`}>{badge.label}</span>
                      <span>Inscrito em {new Date(inscricao.dataInscricao).toLocaleString('pt-BR')}</span>
                      {inscricao.quantidadeAcompanhantes > 0 ? <span>{inscricao.quantidadeAcompanhantes} acompanhante(s)</span> : null}
                    </div>
                  </div>
                  <div className="member-event-card__cta">
                    <Link to={`/eventos/${inscricao.eventoId}`} className="member-action-button--ghost">
                      Ver evento
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="member-panel">
        <div className="member-panel__header">
          <div>
            <h2>Agenda aberta</h2>
            <p>Eventos futuros disponiveis para consulta e, quando possivel, inscricao direta pela area do membro.</p>
          </div>
        </div>

        {loading ? (
          <div className="member-state-card">
            <h2>Carregando eventos</h2>
            <p>Buscando os proximos encontros para voce acompanhar daqui para frente.</p>
          </div>
        ) : eventos.length === 0 ? (
          <div className="member-state-card">
            <h2>Nenhum evento futuro encontrado</h2>
            <p>Assim que a agenda tiver novos encontros, eles aparecerao aqui.</p>
          </div>
        ) : (
          <div className="member-card-grid member-card-grid--two">
            {eventos.map((evento) => {
              const titulo = evento.titulo || evento.nome || 'Evento'
              const descricao = evento.descricao || 'Mais detalhes em breve no Portal.'
              const dataEvento = evento.dataInicio || evento.data || evento.date
              const aceitaInscricoes = evento.aceitaInscricoes || evento.AceitaInscricoes
              const jaInscrito = eventoIdsInscritos.has(evento.id)

              return (
                <div className="member-highlight-card member-highlight-card--tinted" key={evento.id}>
                  <div className="member-panel__header">
                    <div>
                      <h3>{titulo}</h3>
                      <p>{descricao}</p>
                    </div>
                    <span className={`member-badge ${aceitaInscricoes ? 'member-badge--confirmed' : 'member-badge--pending'}`}>
                      {aceitaInscricoes ? 'Inscricoes abertas' : 'Consulta'}
                    </span>
                  </div>

                  <div className="member-highlight-card__meta">
                    <span>{new Date(dataEvento).toLocaleString('pt-BR')}</span>
                    {jaInscrito ? <span>Ja inscrito</span> : null}
                  </div>

                  <div className="member-inline-actions">
                    <Link to={`/eventos/${evento.id}`} className="member-action-button--ghost">
                      Ver detalhes
                    </Link>
                    {aceitaInscricoes && !jaInscrito ? (
                      <button
                        type="button"
                        className="member-action-button"
                        disabled={savingEventId === evento.id}
                        onClick={() => handleInscricaoRapida(evento)}
                      >
                        {savingEventId === evento.id ? 'Inscrevendo...' : 'Inscricao rapida'}
                      </button>
                    ) : null}
                    {aceitaInscricoes && jaInscrito ? (
                      <span className="member-badge member-badge--confirmed">Voce ja esta inscrito</span>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </MemberAreaLayout>
  )
}

export default Events
