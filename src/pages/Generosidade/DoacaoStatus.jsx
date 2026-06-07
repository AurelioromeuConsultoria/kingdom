import { Link, useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import SEO from '../../components/SEO/SEO'
import apiService from '../../services/api.service'
import './Generosidade.css'
import '../../styles/shared-pages.css'

const DONATION_STATUS = {
  PENDING: 1,
  AWAITING_PAYMENT: 2,
  CONFIRMED: 3,
  FAILED: 6
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(value || 0))
}

function formatRemainingTime(milliseconds) {
  if (!milliseconds || milliseconds <= 0) return 'Pix expirado'

  const totalSeconds = Math.floor(milliseconds / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (days > 0) {
    return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}min`
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function getDonationStatusMessage(donation) {
  if (!donation) return ''
  if (donation.status === DONATION_STATUS.CONFIRMED) {
    return 'Recebemos a confirmação do pagamento. Sua contribuição já foi registrada com segurança e agora faz parte do cuidado e da missão que caminhamos juntos como igreja.'
  }
  if (donation.pixCopiaECola || donation.pixQrCodeUrl) {
    return 'Escaneie o QR Code ou copie o código Pix para concluir sua contribuição. Assim que o pagamento for reconhecido, esta página será atualizada automaticamente.'
  }
  if (donation.status === DONATION_STATUS.FAILED) {
    return 'Não foi possível gerar a cobrança agora. A equipe da igreja poderá verificar essa tentativa no Admin.'
  }
  return 'Recebemos sua intenção de doação. Estamos preparando as informações de pagamento.'
}

function DoacaoStatus() {
  const { token } = useParams()
  const location = useLocation()
  const [donation, setDonation] = useState(location.state?.donation || null)
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(!location.state?.donation)
  const [receiptLoading, setReceiptLoading] = useState(false)
  const [pixCopied, setPixCopied] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [error, setError] = useState(null)
  const [now, setNow] = useState(() => Date.now())

  const shouldPollDonation = token &&
    donation?.status &&
    [DONATION_STATUS.PENDING, DONATION_STATUS.AWAITING_PAYMENT].includes(donation.status)
  const pixExpirationDate = donation?.dataVencimento ? new Date(donation.dataVencimento) : null
  const pixRemainingMs = pixExpirationDate ? pixExpirationDate.getTime() - now : null
  const showPixTimer = shouldPollDonation && pixExpirationDate

  const loadDonation = async () => {
    if (!token) return

    try {
      setError(null)
      const response = await apiService.getStatusDoacao(token)
      setDonation(response)
    } catch (err) {
      console.error('Erro ao carregar doação:', err)
      setError('Não encontramos essa doação. Verifique se o link está correto.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDonation()
  }, [token])

  useEffect(() => {
    if (!shouldPollDonation) return undefined

    const interval = window.setInterval(loadDonation, 6000)
    return () => window.clearInterval(interval)
  }, [shouldPollDonation, token])

  useEffect(() => {
    if (!showPixTimer) return undefined

    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [showPixTimer])

  const handleCopyPixCode = async () => {
    if (!donation?.pixCopiaECola) return

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(donation.pixCopiaECola)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = donation.pixCopiaECola
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      setPixCopied(true)
      window.setTimeout(() => setPixCopied(false), 2400)
    } catch (err) {
      console.error('Erro ao copiar código Pix:', err)
      setError('Não foi possível copiar o código Pix automaticamente.')
    }
  }

  const handleLoadReceipt = async () => {
    if (!token) return

    try {
      setReceiptLoading(true)
      setError(null)
      const response = await apiService.getReciboDoacao(token)
      setReceipt(response)
    } catch (err) {
      console.error('Erro ao carregar recibo:', err)
      setError('O recibo ainda não está disponível. Aguarde a confirmação do pagamento.')
    } finally {
      setReceiptLoading(false)
    }
  }

  const handleShareDonation = async () => {
    if (!donation || typeof window === 'undefined') return

    const url = window.location.href
    const title = 'Comprovante de contribuição'
    const text = `Comprovante da contribuição de ${formatCurrency(donation.valor)} para ${donation.finalidadeNome || 'Dízimos e ofertas'}.`

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url })
        return
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const input = document.createElement('input')
        input.value = url
        input.setAttribute('readonly', '')
        input.style.position = 'fixed'
        input.style.opacity = '0'
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
      }

      setShareCopied(true)
      window.setTimeout(() => setShareCopied(false), 2400)
    } catch (err) {
      if (err?.name === 'AbortError') return
      console.error('Erro ao compartilhar doação:', err)
      setError('Não foi possível compartilhar o comprovante agora.')
    }
  }

  return (
    <div className="generosidade-page">
      <SEO
        title="Acompanhar doação"
        description="Acompanhe o status da sua doação online."
        path={`/generosidade/doacao/${token || ''}`}
      />

      <section className="page-title-area">
        <div className="container">
          <h1 className="title">Doação</h1>
          <ul className="breadcrumb-nav">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/generosidade">Generosidade</Link></li>
            <li className="active">Acompanhar doação</li>
          </ul>
        </div>
      </section>

      <section className="section-pad-top-bottom">
        <div className="container">
          <div className="generosidade-status-layout">
            <div className="generosidade-card">
              <div className="generosidade-success">
                <div className="generosidade-success-icon">
                  <i className="fa-solid fa-heart"></i>
                </div>

                {loading ? (
                  <div className="generosidade-loading">Carregando doação...</div>
                ) : donation ? (
                  <>
                    <h3>{donation.status === DONATION_STATUS.CONFIRMED ? 'Doação confirmada' : 'Doação iniciada'}</h3>
                    <p className="generosidade-status-summary">
                      {donation.status === DONATION_STATUS.CONFIRMED
                        ? `Sua doação de ${formatCurrency(donation.valor)} para ${donation.finalidadeNome || 'Dízimos e ofertas'} foi confirmada.`
                        : `Recebemos sua intenção de doar ${formatCurrency(donation.valor)} para ${donation.finalidadeNome || 'Dízimos e ofertas'}.`}
                    </p>
                    <div className={`generosidade-status generosidade-status-${donation.status}`}>
                      {donation.statusDescricao || 'Pendente'}
                    </div>

                    {showPixTimer && (
                      <div className={`generosidade-pix-timer ${pixRemainingMs <= 0 ? 'expired' : ''}`}>
                        <span>Tempo para pagamento</span>
                        <strong>{formatRemainingTime(pixRemainingMs)}</strong>
                        <small>Após esse prazo, gere uma nova doação para receber outro código Pix.</small>
                      </div>
                    )}

                    {(donation.pixQrCodeUrl || donation.pixCopiaECola) && donation.status !== DONATION_STATUS.CONFIRMED && (
                      <div className="generosidade-pix-box">
                        {donation.pixQrCodeUrl && (
                          <img src={donation.pixQrCodeUrl} alt="QR Code Pix" />
                        )}
                        {donation.pixCopiaECola && (
                          <label className="generosidade-field">
                            <span className="generosidade-pix-label">
                              Pix copia e cola
                              <button
                                type="button"
                                className={`generosidade-copy-pix ${pixCopied ? 'copied' : ''}`}
                                onClick={handleCopyPixCode}
                                aria-label="Copiar código Pix"
                                title="Copiar código Pix"
                              >
                                <i className={`fa-solid ${pixCopied ? 'fa-check' : 'fa-copy'}`} aria-hidden="true"></i>
                                <span>{pixCopied ? 'Copiado' : 'Copiar'}</span>
                              </button>
                            </span>
                            <textarea readOnly value={donation.pixCopiaECola} rows={4} />
                          </label>
                        )}
                      </div>
                    )}

                    <p className="generosidade-note">{getDonationStatusMessage(donation)}</p>
                    {donation.status === DONATION_STATUS.CONFIRMED && (
                      <div className="generosidade-confirmation-detail">
                        <div>
                          <span>Valor recebido</span>
                          <strong>{formatCurrency(donation.valor)}</strong>
                        </div>
                        <div>
                          <span>Confirmação</span>
                          <strong>
                            {donation.dataConfirmacao
                              ? new Intl.DateTimeFormat('pt-BR').format(new Date(donation.dataConfirmacao))
                              : 'Confirmada'}
                          </strong>
                        </div>
                      </div>
                    )}
                    {shouldPollDonation && (
                      <p className="generosidade-small-note">Estamos verificando a confirmação automaticamente.</p>
                    )}
                    <div className="generosidade-actions">
                      {donation.reciboDisponivel && (
                        <button type="button" className="generosidade-secondary" onClick={handleLoadReceipt} disabled={receiptLoading}>
                          {receiptLoading ? 'Carregando recibo...' : 'Ver recibo'}
                        </button>
                      )}
                      {donation.reciboDisponivel && (
                        <button type="button" className="generosidade-secondary" onClick={handleShareDonation}>
                          <i className={`fa-solid ${shareCopied ? 'fa-check' : 'fa-share-nodes'}`} aria-hidden="true"></i>
                          {shareCopied ? 'Link copiado' : 'Compartilhar'}
                        </button>
                      )}
                      <Link to="/generosidade" className="generosidade-secondary generosidade-link-button">
                        Fazer outra doação
                      </Link>
                    </div>
                    {receipt && (
                      <div className="generosidade-receipt">
                        <div className="generosidade-receipt-header">
                          <span>Comprovante de contribuição</span>
                          <strong>#{receipt.doacaoId}</strong>
                        </div>
                        <p>
                          Recebemos sua contribuição de <strong>{formatCurrency(receipt.valor)}</strong> para <strong>{receipt.finalidadeNome}</strong> em{' '}
                          <strong>{new Intl.DateTimeFormat('pt-BR').format(new Date(receipt.dataConfirmacao))}</strong>.
                        </p>
                        <div className="generosidade-receipt-grid">
                          <div>
                            <span>Doador</span>
                            <strong>{receipt.anonima ? 'Doação anônima' : receipt.nomeDoador}</strong>
                          </div>
                          <div>
                            <span>Método</span>
                            <strong>{receipt.metodoPagamentoDescricao}</strong>
                          </div>
                          <div>
                            <span>Status</span>
                            <strong>{receipt.statusDescricao}</strong>
                          </div>
                          <div>
                            <span>Registro financeiro</span>
                            <strong>{receipt.receitaId ? `#${receipt.receitaId}` : 'Registrado'}</strong>
                          </div>
                        </div>
                        <small>
                          Este comprovante confirma o registro da contribuição no sistema da igreja. Guarde este link para consultar novamente quando precisar.
                        </small>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <h3>Doação não encontrada</h3>
                    <p>Não foi possível carregar as informações dessa doação.</p>
                  </>
                )}

                {error && <div className="generosidade-error">{error}</div>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DoacaoStatus
