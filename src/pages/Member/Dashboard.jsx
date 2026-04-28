import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MemberAreaLayout from '../../components/MemberArea/MemberAreaLayout'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/api.service'
import './member-area.css'

function Dashboard() {
  const { user } = useAuth()
  const [escalas, setEscalas] = useState([])
  const [notificacoes, setNotificacoes] = useState([])
  const [eventos, setEventos] = useState([])
  const [criancas, setCriancas] = useState([])
  const [avisosKids, setAvisosKids] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        const [escalasData, notificacoesData, eventosData, countData, criancasData, avisosKidsData] = await Promise.all([
          apiService.getMinhasEscalas().catch(() => []),
          apiService.getMinhasNotificacoes({ limit: 4 }).catch(() => []),
          apiService.getUpcomingEvents(3).catch(() => []),
          apiService.getCountNotificacoesNaoLidas().catch(() => ({ count: 0 })),
          apiService.getMinhasCriancasKids().catch(() => []),
          apiService.getMeusAvisosKids({ limit: 3 }).catch(() => [])
        ])

        if (!active) return
        setEscalas(Array.isArray(escalasData) ? escalasData : [])
        setNotificacoes(Array.isArray(notificacoesData) ? notificacoesData : [])
        setEventos(Array.isArray(eventosData) ? eventosData : [])
        setUnreadCount(countData?.count || 0)
        setCriancas(Array.isArray(criancasData) ? criancasData : [])
        setAvisosKids(Array.isArray(avisosKidsData) ? avisosKidsData : [])
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadData()
    return () => { active = false }
  }, [])

  const escalaResumo = useMemo(() => {
    const itens = escalas.flatMap((escala) => Array.isArray(escala.itens) ? escala.itens : [])
      .filter((item) => item.voluntarioPessoaId === user?.pessoaId)

    return {
      total: itens.length,
      confirmadas: itens.filter((item) => item.status === 2 || item.status === 'Confirmado').length,
      pendentes: itens.filter((item) => item.status === 1 || item.status === 'Pendente').length,
      recusadas: itens.filter((item) => item.status === 3 || item.status === 'Recusado').length
    }
  }, [escalas, user?.pessoaId])

  if (loading) {
    return (
      <MemberAreaLayout
        title={`Bem-vindo, ${user?.nome?.split(' ')[0] || 'membro'}`}
        description="Estamos organizando seus dados principais."
      >
        <div className="member-state-card">
          <h2>Carregando seu painel</h2>
          <p>Buscando escalas, notificacoes e eventos mais recentes.</p>
        </div>
      </MemberAreaLayout>
    )
  }

  return (
    <MemberAreaLayout
      title={`Bem-vindo, ${user?.nome?.split(' ')[0] || 'membro'}`}
      description="Sua area autenticada no Portal concentra o que voce precisa acompanhar sem depender do admin."
      actions={
        <>
          <Link to="/area-do-membro/escalas" className="member-action-button">
            Ver minhas escalas
          </Link>
          <Link to="/area-do-membro/oracao" className="member-action-button--ghost">
            Pedido de oracao
          </Link>
          <Link to="/area-do-membro/notificacoes" className="member-action-button--ghost">
            Notificacoes
          </Link>
        </>
      }
    >
      <div className="member-kpis">
        <div className="member-kpi">
          <span>Escalas</span>
          <strong>{escalaResumo.total}</strong>
          <small>Total de convites encontrados para sua conta</small>
        </div>
        <div className="member-kpi">
          <span>Pendentes</span>
          <strong>{escalaResumo.pendentes}</strong>
          <small>Respostas que ainda dependem de voce</small>
        </div>
        <div className="member-kpi">
          <span>Confirmadas</span>
          <strong>{escalaResumo.confirmadas}</strong>
          <small>Escalas que ja receberam seu aceite</small>
        </div>
        <div className="member-kpi">
          <span>Notificacoes</span>
          <strong>{unreadCount}</strong>
          <small>Mensagens internas ainda nao lidas</small>
        </div>
      </div>

      <div className="member-card-grid member-card-grid--two">
        <div className="member-panel">
          <div className="member-panel__header">
            <div>
              <h2>Proximas escalas</h2>
              <p>Seu acompanhamento principal dentro da area do membro.</p>
            </div>
          </div>

          {escalas.length === 0 ? (
            <div className="member-state-card">
              <h2>Nenhuma escala encontrada</h2>
              <p>Quando voce for escalado, esta area vai te ajudar a responder e acompanhar tudo.</p>
            </div>
          ) : (
            <div className="member-list">
              {escalas.slice(0, 3).map((escala) => {
                const meuItem = (escala.itens || []).find((item) => item.voluntarioPessoaId === user?.pessoaId)
                return (
                  <div className="member-highlight-card" key={escala.id}>
                    <h3>{escala.eventoTitulo} · {escala.equipeNome}</h3>
                    <p>{new Date(escala.eventoDataHoraInicio).toLocaleString('pt-BR')}</p>
                    {meuItem ? (
                      <div className="member-highlight-card__meta">
                        <span className={`member-badge ${
                          meuItem.status === 2 ? 'member-badge--confirmed' :
                          meuItem.status === 3 ? 'member-badge--refused' :
                          'member-badge--pending'
                        }`}
                        >
                          {meuItem.status === 2 ? 'Confirmado' : meuItem.status === 3 ? 'Recusado' : 'Pendente'}
                        </span>
                        <span>{meuItem.cargoNome || 'Sem cargo'}</span>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="member-panel">
          <div className="member-panel__header">
            <div>
              <h2>Notificacoes recentes</h2>
              <p>Aqui entram avisos de escala, trocas e comunicados internos.</p>
            </div>
          </div>

          {notificacoes.length === 0 ? (
            <div className="member-state-card">
              <h2>Nada novo por enquanto</h2>
              <p>Quando surgirem avisos importantes, eles aparecerao aqui.</p>
            </div>
          ) : (
            <div className="member-list">
              {notificacoes.map((notificacao) => (
                <div className="member-highlight-card" key={notificacao.id}>
                  <h3>{notificacao.titulo}</h3>
                  <p>{notificacao.mensagem}</p>
                  <div className="member-highlight-card__meta">
                    <span className={`member-badge ${notificacao.lida ? 'member-badge--neutral' : 'member-badge--pending'}`}>
                      {notificacao.lida ? 'Lida' : 'Nao lida'}
                    </span>
                    <span>{new Date(notificacao.dataCriacao).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="member-card-grid member-card-grid--two">
        <div className="member-highlight-card">
          <h3>Cuidado pastoral acessivel</h3>
          <p>A area do membro agora tambem pode ser um canal simples para pedidos de oracao e cuidado.</p>
          <div className="member-inline-actions">
            <Link to="/area-do-membro/oracao" className="member-action-button">
              Abrir pedido de oracao
            </Link>
          </div>
        </div>
        <div className="member-highlight-card">
          <h3>Autosservico real</h3>
          <p>Seu perfil ja deixou de ser apenas leitura: voce pode atualizar o proprio cadastro e ajustar preferencias.</p>
          <div className="member-inline-actions">
            <Link to="/area-do-membro/perfil" className="member-action-button--ghost">
              Editar meu perfil
            </Link>
          </div>
        </div>
      </div>

      <div className="member-card-grid member-card-grid--two">
        <div className="member-panel">
          <div className="member-panel__header">
            <div>
              <h2>Minha familia no Kids</h2>
              <p>Quando voce for responsavel, esta area passa a integrar check-ins, avisos e alertas da crianca.</p>
            </div>
            <Link to="/area-do-membro/familia" className="member-action-button--ghost">
              Abrir familia
            </Link>
          </div>

          {criancas.length === 0 ? (
            <div className="member-state-card">
              <h2>Nenhuma crianca vinculada</h2>
              <p>Se houver vinculo de responsavel no Kids, ele passa a aparecer automaticamente aqui.</p>
            </div>
          ) : (
            <div className="member-list">
              {criancas.slice(0, 3).map((crianca) => (
                <div className="member-highlight-card" key={crianca.pessoaId}>
                  <h3>{crianca.nome}</h3>
                  <p>
                    {crianca.turmaId ? `Turma ${crianca.turmaId}` : 'Turma nao informada'}
                    {crianca.salaId ? ` · Sala ${crianca.salaId}` : ''}
                  </p>
                  <div className="member-highlight-card__meta">
                    <span className={`member-badge ${crianca.estaCheckedIn ? 'member-badge--confirmed' : 'member-badge--neutral'}`}>
                      {crianca.estaCheckedIn ? 'Checked-in agora' : 'Fora do check-in'}
                    </span>
                    {crianca.temAlertaCritico ? (
                      <span className="member-badge member-badge--refused">Alerta critico</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="member-panel">
          <div className="member-panel__header">
            <div>
              <h2>Avisos do Kids</h2>
              <p>Primeira integracao da area do membro com a experiencia de responsavel.</p>
            </div>
          </div>

          {avisosKids.length === 0 ? (
            <div className="member-state-card">
              <h2>Nenhum aviso recente</h2>
              <p>Quando houver comunicacoes do Kids, elas aparecerao aqui tambem.</p>
            </div>
          ) : (
            <div className="member-list">
              {avisosKids.map((aviso) => (
                <div className="member-highlight-card" key={aviso.id}>
                  <h3>{aviso.titulo}</h3>
                  <p>{aviso.mensagem}</p>
                  <div className="member-highlight-card__meta">
                    <span className={`member-badge ${aviso.foiLido ? 'member-badge--neutral' : 'member-badge--pending'}`}>
                      {aviso.foiLido ? 'Lido' : 'Novo'}
                    </span>
                    {aviso.criancaNome ? <span>{aviso.criancaNome}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="member-panel">
        <div className="member-panel__header">
          <div>
            <h2>Eventos em destaque</h2>
            <p>Primeira base da sua jornada autenticada. Historico de inscricoes pode vir na proxima fase.</p>
          </div>
        </div>

        {eventos.length === 0 ? (
          <div className="member-state-card">
            <h2>Nenhum evento encontrado</h2>
            <p>Assim que houver eventos futuros, eles aparecerao nesta area.</p>
          </div>
        ) : (
          <div className="member-card-grid member-card-grid--two">
            {eventos.map((evento) => (
              <div className="member-highlight-card" key={evento.id}>
                <h3>{evento.titulo || evento.nome || 'Evento'}</h3>
                <p>{evento.descricao || 'Mais detalhes em breve no portal.'}</p>
                <div className="member-highlight-card__meta">
                  <span>{new Date(evento.dataInicio || evento.data || evento.date).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MemberAreaLayout>
  )
}

export default Dashboard
