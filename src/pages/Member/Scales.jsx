import { useEffect, useMemo, useState } from 'react'
import MemberAreaLayout from '../../components/MemberArea/MemberAreaLayout'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/api.service'
import './member-area.css'

function getStatusInfo(status) {
  if (status === 2 || status === 'Confirmado') {
    return { label: 'Confirmado', className: 'member-badge--confirmed' }
  }
  if (status === 3 || status === 'Recusado') {
    return { label: 'Recusado', className: 'member-badge--refused' }
  }
  if (status === 5 || status === 'Serviu') {
    return { label: 'Serviu', className: 'member-badge--served' }
  }
  if (status === 6 || status === 'Faltou') {
    return { label: 'Faltou', className: 'member-badge--missed' }
  }
  return { label: 'Pendente', className: 'member-badge--pending' }
}

function getSwapStatusInfo(status) {
  if (status === 2 || status === 'Aprovada') {
    return { label: 'Aprovada', className: 'member-badge--confirmed' }
  }
  if (status === 3 || status === 'Rejeitada') {
    return { label: 'Rejeitada', className: 'member-badge--refused' }
  }
  return { label: 'Pendente', className: 'member-badge--pending' }
}

function Scales() {
  const { user } = useAuth()
  const [escalas, setEscalas] = useState([])
  const [solicitacoes, setSolicitacoes] = useState([])
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [swapDraft, setSwapDraft] = useState({ itemId: null, motivo: '' })

  const loadPage = async () => {
    const [escalasData, solicitacoesData] = await Promise.all([
      apiService.getMinhasEscalas().catch(() => []),
      apiService.getMinhasSolicitacoesTrocaEscala().catch(() => [])
    ])

    setEscalas(Array.isArray(escalasData) ? escalasData : [])
    setSolicitacoes(Array.isArray(solicitacoesData) ? solicitacoesData : [])
  }

  useEffect(() => {
    let active = true

    async function bootstrap() {
      try {
        const [escalasData, solicitacoesData] = await Promise.all([
          apiService.getMinhasEscalas().catch(() => []),
          apiService.getMinhasSolicitacoesTrocaEscala().catch(() => [])
        ])
        if (!active) return
        setEscalas(Array.isArray(escalasData) ? escalasData : [])
        setSolicitacoes(Array.isArray(solicitacoesData) ? solicitacoesData : [])
      } finally {
        if (active) setLoading(false)
      }
    }

    bootstrap()
    return () => { active = false }
  }, [])

  const minhasEscalas = useMemo(() => (
    escalas.map((escala) => ({
      ...escala,
      meuItem: (escala.itens || []).find((item) => item.voluntarioPessoaId === user?.pessoaId)
    })).filter((escala) => escala.meuItem)
  ), [escalas, user?.pessoaId])

  const scaleStats = useMemo(() => ({
    total: minhasEscalas.length,
    pendentes: minhasEscalas.filter((escala) => getStatusInfo(escala.meuItem.status).label === 'Pendente').length,
    confirmadas: minhasEscalas.filter((escala) => getStatusInfo(escala.meuItem.status).label === 'Confirmado').length,
    recusadas: minhasEscalas.filter((escala) => getStatusInfo(escala.meuItem.status).label === 'Recusado').length
  }), [minhasEscalas])

  const handleConfirmar = async (escala) => {
    setSavingId(escala.meuItem.id)
    setFeedback({ type: '', message: '' })

    try {
      await apiService.confirmarEscalaItem(escala.id, escala.meuItem.id)
      await loadPage()
      setFeedback({ type: 'success', message: 'Sua confirmacao foi registrada.' })
    } catch {
      setFeedback({ type: 'error', message: 'Nao foi possivel confirmar sua escala agora.' })
    } finally {
      setSavingId(null)
    }
  }

  const handleRecusar = async (escala) => {
    const motivo = window.prompt('Se quiser, descreva rapidamente o motivo da recusa:')
    setSavingId(escala.meuItem.id)
    setFeedback({ type: '', message: '' })

    try {
      await apiService.recusarEscalaItem(escala.id, escala.meuItem.id, motivo || '')
      await loadPage()
      setFeedback({ type: 'success', message: 'Sua recusa foi registrada.' })
    } catch {
      setFeedback({ type: 'error', message: 'Nao foi possivel recusar sua escala agora.' })
    } finally {
      setSavingId(null)
    }
  }

  const handleSolicitarTroca = async (escala) => {
    if (!swapDraft.motivo.trim()) {
      setFeedback({ type: 'error', message: 'Escreva um motivo curto para solicitar a troca.' })
      return
    }

    setSavingId(escala.meuItem.id)
    setFeedback({ type: '', message: '' })

    try {
      await apiService.criarSolicitacaoTrocaEscala(escala.id, escala.meuItem.id, {
        motivo: swapDraft.motivo.trim()
      })
      setSwapDraft({ itemId: null, motivo: '' })
      await loadPage()
      setFeedback({ type: 'success', message: 'Sua solicitacao de troca foi enviada para a lideranca.' })
    } catch {
      setFeedback({ type: 'error', message: 'Nao foi possivel solicitar a troca agora.' })
    } finally {
      setSavingId(null)
    }
  }

  const openSwapDraft = (itemId) => {
    setSwapDraft({ itemId, motivo: '' })
    setFeedback({ type: '', message: '' })
  }

  return (
    <MemberAreaLayout
      title="Minhas escalas"
      description="Aqui voce acompanha seus proximos servicos, responde rapido e, quando precisar, ja abre uma solicitacao de troca sem depender do admin."
    >
      <div className="member-kpis">
        <div className="member-kpi">
          <span>Total</span>
          <strong>{scaleStats.total}</strong>
          <small>Escalas vinculadas ao seu perfil</small>
        </div>
        <div className="member-kpi">
          <span>Confirmadas</span>
          <strong>{scaleStats.confirmadas}</strong>
          <small>Convites ja assumidos por voce</small>
        </div>
        <div className="member-kpi">
          <span>Pendentes</span>
          <strong>{scaleStats.pendentes}</strong>
          <small>Escalas que ainda aguardam resposta</small>
        </div>
        <div className="member-kpi">
          <span>Trocas abertas</span>
          <strong>{solicitacoes.filter((item) => getSwapStatusInfo(item.status).label === 'Pendente').length}</strong>
          <small>Solicitacoes aguardando retorno</small>
        </div>
      </div>

      {feedback.message ? (
        <div className={`member-feedback ${feedback.type === 'error' ? 'member-feedback--error' : 'member-feedback--success'}`}>
          {feedback.message}
        </div>
      ) : null}

      {loading ? (
        <div className="member-state-card">
          <h2>Carregando suas escalas</h2>
          <p>Estamos buscando os convites e as trocas vinculados ao seu perfil.</p>
        </div>
      ) : minhasEscalas.length === 0 ? (
        <div className="member-state-card">
          <h2>Nenhuma escala por enquanto</h2>
          <p>Quando voce for escalado, os convites aparecerao aqui com confirmacao e recusa em um clique.</p>
        </div>
      ) : (
        <div className="member-list">
          {minhasEscalas.map((escala) => {
            const status = getStatusInfo(escala.meuItem.status)
            const disabled = savingId === escala.meuItem.id
            const swapOpen = swapDraft.itemId === escala.meuItem.id
            const hasOpenRequest = solicitacoes.some((item) => item.escalaItemId === escala.meuItem.id && getSwapStatusInfo(item.status).label === 'Pendente')

            return (
              <div className="member-panel" key={escala.id}>
                <div className="member-panel__header">
                  <div>
                    <h2>{escala.eventoTitulo}</h2>
                    <p>{escala.equipeNome} · {new Date(escala.eventoDataHoraInicio).toLocaleString('pt-BR')}</p>
                  </div>
                  <span className={`member-badge ${status.className}`}>{status.label}</span>
                </div>

                <div className="member-highlight-card__meta">
                  <span>{escala.meuItem.cargoNome || 'Sem cargo definido'}</span>
                  {escala.meuItem.dataConfirmacao ? <span>Respondido em {new Date(escala.meuItem.dataConfirmacao).toLocaleString('pt-BR')}</span> : null}
                  {escala.meuItem.dataRecusa ? <span>Recusado em {new Date(escala.meuItem.dataRecusa).toLocaleString('pt-BR')}</span> : null}
                  {escala.meuItem.motivoRecusa ? <span>Motivo: {escala.meuItem.motivoRecusa}</span> : null}
                </div>

                <div className="member-inline-actions">
                  <button
                    type="button"
                    className={status.label === 'Confirmado' ? 'member-action-button member-action-button--success' : 'member-action-button--ghost'}
                    disabled={disabled}
                    onClick={() => handleConfirmar(escala)}
                  >
                    {status.label === 'Confirmado' ? 'Confirmado' : 'Confirmar'}
                  </button>
                  <button
                    type="button"
                    className={status.label === 'Recusado' ? 'member-action-button--danger' : 'member-action-button--ghost'}
                    disabled={disabled}
                    onClick={() => handleRecusar(escala)}
                  >
                    {status.label === 'Recusado' ? 'Recusado' : 'Recusar'}
                  </button>
                  <button
                    type="button"
                    className={hasOpenRequest ? 'member-action-button member-action-button--soft' : 'member-action-button--ghost'}
                    disabled={disabled}
                    onClick={() => openSwapDraft(escala.meuItem.id)}
                  >
                    {hasOpenRequest ? 'Troca solicitada' : 'Solicitar troca'}
                  </button>
                </div>

                {swapOpen ? (
                  <div className="member-inline-form">
                    <label className="member-inline-form__field">
                      <span>Explique rapidamente o motivo</span>
                      <textarea
                        rows="3"
                        value={swapDraft.motivo}
                        onChange={(event) => setSwapDraft((prev) => ({ ...prev, motivo: event.target.value }))}
                        placeholder="Ex.: estarei viajando, compromisso de familia, imprevisto profissional..."
                      />
                    </label>
                    <div className="member-inline-actions">
                      <button
                        type="button"
                        className="member-action-button"
                        disabled={disabled}
                        onClick={() => handleSolicitarTroca(escala)}
                      >
                        Enviar solicitacao
                      </button>
                      <button
                        type="button"
                        className="member-action-button--ghost"
                        disabled={disabled}
                        onClick={() => setSwapDraft({ itemId: null, motivo: '' })}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}

      <div className="member-panel">
        <div className="member-panel__header">
          <div>
            <h2>Minhas solicitacoes de troca</h2>
            <p>Historico rapido para voce saber o que ainda esta aguardando aprovacao e o que ja foi resolvido.</p>
          </div>
        </div>

        {solicitacoes.length === 0 ? (
          <p className="member-page-note">Nenhuma solicitacao registrada por enquanto.</p>
        ) : (
          <div className="member-card-grid">
            {solicitacoes.map((solicitacao) => {
              const badge = getSwapStatusInfo(solicitacao.status)
              return (
                <div className="member-highlight-card member-highlight-card--tinted" key={solicitacao.id}>
                  <div className="member-panel__header">
                    <div>
                      <h3>{solicitacao.eventoTitulo}</h3>
                      <p>{solicitacao.equipeNome} · {solicitacao.eventoDataHoraInicio ? new Date(solicitacao.eventoDataHoraInicio).toLocaleString('pt-BR') : 'Data nao informada'}</p>
                    </div>
                    <span className={`member-badge ${badge.className}`}>{badge.label}</span>
                  </div>
                  <div className="member-highlight-card__meta">
                    <span>Solicitada em {new Date(solicitacao.dataSolicitacao).toLocaleString('pt-BR')}</span>
                    {solicitacao.voluntarioSubstitutoNome ? <span>Substituto: {solicitacao.voluntarioSubstitutoNome}</span> : null}
                    {solicitacao.respondidoPorUsuarioNome ? <span>Respondido por {solicitacao.respondidoPorUsuarioNome}</span> : null}
                  </div>
                  {solicitacao.motivo ? <p className="member-page-note">Motivo: {solicitacao.motivo}</p> : null}
                  {solicitacao.observacaoResposta ? <p className="member-page-note">Resposta: {solicitacao.observacaoResposta}</p> : null}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </MemberAreaLayout>
  )
}

export default Scales
