import { useEffect, useState } from 'react'
import MemberAreaLayout from '../../components/MemberArea/MemberAreaLayout'
import apiService from '../../services/api.service'
import './member-area.css'

function Family() {
  const [criancas, setCriancas] = useState([])
  const [avisos, setAvisos] = useState([])
  const [checkins, setCheckins] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    const [criancasData, avisosData, checkinsData] = await Promise.all([
      apiService.getMinhasCriancasKids().catch(() => []),
      apiService.getMeusAvisosKids({ limit: 20 }).catch(() => []),
      apiService.getMeusCheckinsKids().catch(() => [])
    ])

    setCriancas(Array.isArray(criancasData) ? criancasData : [])
    setAvisos(Array.isArray(avisosData) ? avisosData : [])
    setCheckins(Array.isArray(checkinsData) ? checkinsData : [])
  }

  useEffect(() => {
    let active = true

    async function bootstrap() {
      try {
        await loadData()
      } finally {
        if (active) setLoading(false)
      }
    }

    bootstrap()
    return () => { active = false }
  }, [])

  const handleMarcarAvisoComoLido = async (id) => {
    await apiService.marcarAvisoKidsComoLido(id)
    await loadData()
  }

  return (
    <MemberAreaLayout
      title="Minha familia"
      description="Essa area conecta o portal autenticado com a jornada de responsavel no Kids, sem criar um produto separado."
    >
      {loading ? (
        <div className="member-state-card">
          <h2>Carregando contexto da familia</h2>
          <p>Buscando criancas vinculadas, avisos e check-ins permitidos.</p>
        </div>
      ) : (
        <>
          <div className="member-card-grid member-card-grid--two">
            <div className="member-panel">
              <div className="member-panel__header">
                <div>
                  <h2>Criancas vinculadas</h2>
                  <p>Resumo rapido da relacao entre o responsavel autenticado e o Kids.</p>
                </div>
              </div>

              {criancas.length === 0 ? (
                <div className="member-state-card">
                  <h2>Nenhuma crianca vinculada</h2>
                  <p>Quando houver vinculo de responsavel, essa area ficara muito mais rica.</p>
                </div>
              ) : (
                <div className="member-list">
                  {criancas.map((crianca) => (
                    <div className="member-highlight-card" key={crianca.pessoaId}>
                      <h3>{crianca.nome}</h3>
                      <p>
                        {crianca.turmaId ? `Turma ${crianca.turmaId}` : 'Turma nao informada'}
                        {crianca.salaId ? ` · Sala ${crianca.salaId}` : ''}
                      </p>
                      <div className="member-highlight-card__meta">
                        <span className={`member-badge ${crianca.estaCheckedIn ? 'member-badge--confirmed' : 'member-badge--neutral'}`}>
                          {crianca.estaCheckedIn ? 'Checked-in agora' : 'Sem check-in ativo'}
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
                  <h2>Check-ins recentes</h2>
                  <p>Visao inicial da experiencia do responsavel dentro do portal.</p>
                </div>
              </div>

              {checkins.length === 0 ? (
                <div className="member-state-card">
                  <h2>Nenhum check-in encontrado</h2>
                  <p>Os registros de entrada e saida aparecerao aqui quando existirem para sua familia.</p>
                </div>
              ) : (
                <div className="member-list">
                  {checkins.map((checkin) => (
                    <div className="member-highlight-card" key={checkin.id}>
                      <h3>{checkin.criancaNome}</h3>
                      <p>Check-in em {new Date(checkin.checkinTime).toLocaleString('pt-BR')}</p>
                      <div className="member-highlight-card__meta">
                        <span className={`member-badge ${checkin.checkoutTime ? 'member-badge--neutral' : 'member-badge--confirmed'}`}>
                          {checkin.status}
                        </span>
                        {checkin.salaId ? <span>Sala {checkin.salaId}</span> : null}
                        {checkin.pinRetirada ? <span>PIN {checkin.pinRetirada}</span> : null}
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
                <h2>Avisos do Kids</h2>
                <p>Comunicacoes vindas da operacao do ministerio ou de avisos direcionados ao responsavel.</p>
              </div>
            </div>

            {avisos.length === 0 ? (
              <div className="member-state-card">
                <h2>Nenhum aviso no momento</h2>
                <p>Quando o Kids enviar comunicacoes para voce, elas ficarao organizadas aqui.</p>
              </div>
            ) : (
              <div className="member-list">
                {avisos.map((aviso) => (
                  <div className="member-panel" key={aviso.id}>
                    <div className="member-panel__header">
                      <div>
                        <h2>{aviso.titulo}</h2>
                        <p>{new Date(aviso.dataCriacao).toLocaleString('pt-BR')}</p>
                      </div>
                      <span className={`member-badge ${aviso.foiLido ? 'member-badge--neutral' : 'member-badge--pending'}`}>
                        {aviso.foiLido ? 'Lido' : 'Nao lido'}
                      </span>
                    </div>
                    <p>{aviso.mensagem}</p>
                    <div className="member-highlight-card__meta">
                      {aviso.criancaNome ? <span>{aviso.criancaNome}</span> : null}
                      <span>{aviso.tipo}</span>
                    </div>
                    {!aviso.foiLido ? (
                      <div className="member-inline-actions">
                        <button type="button" className="member-action-button--ghost" onClick={() => handleMarcarAvisoComoLido(aviso.id)}>
                          Marcar como lido
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </MemberAreaLayout>
  )
}

export default Family
