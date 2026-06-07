import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import SEO from '../../components/SEO/SEO'
import apiService from '../../services/api.service'
import './Generosidade.css'
import '../../styles/shared-pages.css'

const PAYMENT_METHOD = {
  PIX: 1,
  CREDIT_CARD: 2
}

const DONATION_STATUS = {
  PENDING: 1,
  AWAITING_PAYMENT: 2,
  CONFIRMED: 3,
  FAILED: 6
}

const fallbackFinalidades = [
  {
    id: null,
    nome: 'Dízimos e ofertas',
    slug: 'dizimos-ofertas',
    descricaoPublica: 'Contribua com a missão da igreja de forma simples e segura.',
    valoresSugeridos: [20, 50, 100, 200],
    valorMinimo: 1,
    permiteAnonimo: true,
    permitePix: true,
    permiteCartaoCredito: false
  }
]

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(value || 0))
}

function currencyToCents(value) {
  return Number(String(value || '').replace(/\D/g, '') || 0)
}

function normalizePhone(value) {
  return String(value || '').replace(/\D/g, '')
}

function getDonationStatusMessage(donation) {
  if (!donation) return ''
  if (donation.status === DONATION_STATUS.CONFIRMED) {
    return 'Pagamento confirmado. Obrigado por contribuir com a missão.'
  }
  if (donation.pixCopiaECola || donation.pixQrCodeUrl) {
    return 'Escaneie o QR Code ou copie o código Pix para concluir sua contribuição.'
  }
  if (donation.status === DONATION_STATUS.FAILED) {
    return 'Não foi possível gerar a cobrança agora. A equipe da igreja poderá verificar essa tentativa no Admin.'
  }
  return 'Recebemos sua intenção de doação. Assim que a integração Asaas estiver ativa, esta etapa exibirá o QR Code Pix automaticamente.'
}

function Generosidade() {
  const navigate = useNavigate()
  const [finalidades, setFinalidades] = useState([])
  const [selectedFinalidadeId, setSelectedFinalidadeId] = useState(null)
  const [selectedValue, setSelectedValue] = useState('')
  const [customValueCents, setCustomValueCents] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.PIX)
  const [formData, setFormData] = useState({
    nomeDoador: '',
    whatsApp: '',
    email: '',
    documento: '',
    anonima: false
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [createdDonation, setCreatedDonation] = useState(null)
  const [receipt, setReceipt] = useState(null)
  const [receiptLoading, setReceiptLoading] = useState(false)
  const [pixCopied, setPixCopied] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await apiService.getFinalidadesDoacao()
        const items = Array.isArray(data) && data.length > 0 ? data : fallbackFinalidades
        setFinalidades(items)
        setSelectedFinalidadeId(items[0]?.id ?? null)
      } catch (err) {
        console.error('Erro ao carregar finalidades de doação:', err)
        setFinalidades(fallbackFinalidades)
        setSelectedFinalidadeId(fallbackFinalidades[0].id)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const selectedFinalidade = useMemo(() => {
    return finalidades.find((item) => item.id === selectedFinalidadeId) || finalidades[0] || null
  }, [finalidades, selectedFinalidadeId])

  const suggestedValues = selectedFinalidade?.valoresSugeridos?.length
    ? selectedFinalidade.valoresSugeridos
    : [20, 50, 100, 200]

  const donationValue = customValueCents > 0 ? customValueCents / 100 : Number(selectedValue || 0)
  const customValueDisplay = customValueCents > 0 ? formatCurrency(customValueCents / 100) : ''
  const minimumValue = selectedFinalidade?.valorMinimo || 1
  const paymentMethods = [
    { id: PAYMENT_METHOD.PIX, label: 'Pix', enabled: selectedFinalidade?.permitePix !== false },
    { id: PAYMENT_METHOD.CREDIT_CARD, label: 'Cartão de crédito', enabled: !!selectedFinalidade?.permiteCartaoCredito }
  ]

  const shouldPollDonation = createdDonation?.reciboToken &&
    [DONATION_STATUS.PENDING, DONATION_STATUS.AWAITING_PAYMENT].includes(createdDonation.status)

  useEffect(() => {
    const methodIsAvailable = paymentMethods.some((method) => method.id === paymentMethod && method.enabled)
    if (!methodIsAvailable) {
      const firstAvailable = paymentMethods.find((method) => method.enabled)
      if (firstAvailable) setPaymentMethod(firstAvailable.id)
    }
  }, [selectedFinalidadeId])

  useEffect(() => {
    if (!shouldPollDonation) return undefined

    const interval = window.setInterval(async () => {
      try {
        const updated = await apiService.getStatusDoacao(createdDonation.reciboToken)
        setCreatedDonation((current) => current?.reciboToken === updated.reciboToken ? { ...current, ...updated } : current)
      } catch (err) {
        console.error('Erro ao consultar status da doação:', err)
      }
    }, 6000)

    return () => window.clearInterval(interval)
  }, [shouldPollDonation, createdDonation?.reciboToken])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!selectedFinalidade) {
      setError('Selecione uma finalidade para continuar.')
      return
    }

    if (!formData.nomeDoador.trim()) {
      setError('Informe seu nome para continuar.')
      return
    }

    if (donationValue < minimumValue) {
      setError(`O valor mínimo para esta doação é ${formatCurrency(minimumValue)}.`)
      return
    }

    if (paymentMethod === PAYMENT_METHOD.PIX && !formData.documento.replace(/\D/g, '')) {
      setError('Informe seu CPF ou CNPJ para gerar a cobrança Pix.')
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      const response = await apiService.criarDoacao({
        finalidadeDoacaoId: selectedFinalidade.id,
        nomeDoador: formData.nomeDoador.trim(),
        whatsApp: normalizePhone(formData.whatsApp) || null,
        email: formData.email.trim() || null,
        documento: formData.documento.replace(/\D/g, '') || null,
        anonima: formData.anonima,
        valor: donationValue,
        metodoPagamento: paymentMethod
      })

      setCreatedDonation(response)
      setReceipt(null)
      setPixCopied(false)
      if (response?.reciboToken) {
        navigate(`/generosidade/doacao/${response.reciboToken}`, { state: { donation: response } })
      }
    } catch (err) {
      console.error('Erro ao criar doação:', err)
      setError(err.response?.data?.message || 'Não foi possível iniciar sua doação agora. Tente novamente em alguns instantes.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLoadReceipt = async () => {
    if (!createdDonation?.reciboToken) return

    try {
      setReceiptLoading(true)
      setError(null)
      const response = await apiService.getReciboDoacao(createdDonation.reciboToken)
      setReceipt(response)
    } catch (err) {
      console.error('Erro ao carregar recibo:', err)
      setError('O recibo ainda não está disponível. Aguarde a confirmação do pagamento.')
    } finally {
      setReceiptLoading(false)
    }
  }

  const handleCopyPixCode = async () => {
    if (!createdDonation?.pixCopiaECola) return

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(createdDonation.pixCopiaECola)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = createdDonation.pixCopiaECola
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

  return (
    <div className="generosidade-page">
      <SEO
        title="Generosidade e Contribuição"
        description="Contribua com a Kingdom em Guarulhos. Generosidade como expressão de gratidão. Formas de doar e participar da visão da igreja."
        path="/generosidade"
      />

      <section className="page-title-area">
        <div className="container">
          <h1 className="title">Generosidade</h1>
          <ul className="breadcrumb-nav">
            <li><Link to="/">Home</Link></li>
            <li className="active">Generosidade</li>
          </ul>
        </div>
      </section>

      <section className="section-pad-top-bottom">
        <div className="container">
          <div className="generosidade-grid">
            <div className="generosidade-copy">
              <span className="generosidade-kicker">Contribuição online</span>
              <h2>Contribuir é participar da missão</h2>
              <p>
                A generosidade é uma expressão prática de gratidão, cuidado e compromisso com aquilo que Deus está construindo em nossa comunidade.
              </p>
              <p>
                Escolha uma finalidade, informe o valor e avance com a forma de doação disponível. Sua contribuição será registrada com cuidado e transparência.
              </p>
            </div>

            <div className="generosidade-card">
              {createdDonation ? (
                <div className="generosidade-success">
                  <div className="generosidade-success-icon">
                    <i className="fa-solid fa-heart"></i>
                  </div>
                  <h3>Doação iniciada</h3>
                  <p>
                    Recebemos sua intenção de doar {formatCurrency(createdDonation.valor)} para {createdDonation.finalidadeNome || selectedFinalidade?.nome}.
                  </p>
                  <div className={`generosidade-status generosidade-status-${createdDonation.status}`}>
                    {createdDonation.statusDescricao || 'Pendente'}
                  </div>
                  {(createdDonation.pixQrCodeUrl || createdDonation.pixCopiaECola) && (
                    <div className="generosidade-pix-box">
                      {createdDonation.pixQrCodeUrl && (
                        <img src={createdDonation.pixQrCodeUrl} alt="QR Code Pix" />
                      )}
                      {createdDonation.pixCopiaECola && (
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
                          <textarea readOnly value={createdDonation.pixCopiaECola} rows={4} />
                        </label>
                      )}
                    </div>
                  )}
                  <p className="generosidade-note">{getDonationStatusMessage(createdDonation)}</p>
                  {shouldPollDonation && (
                    <p className="generosidade-small-note">Estamos verificando a confirmação automaticamente.</p>
                  )}
                  {createdDonation.reciboDisponivel && (
                    <button type="button" className="generosidade-secondary" onClick={handleLoadReceipt} disabled={receiptLoading}>
                      {receiptLoading ? 'Carregando recibo...' : 'Ver recibo'}
                    </button>
                  )}
                  {receipt && (
                    <div className="generosidade-receipt">
                      <div>
                        <span>Recibo</span>
                        <strong>#{receipt.doacaoId}</strong>
                      </div>
                      <div>
                        <span>Doador</span>
                        <strong>{receipt.nomeDoador}</strong>
                      </div>
                      <div>
                        <span>Finalidade</span>
                        <strong>{receipt.finalidadeNome}</strong>
                      </div>
                      <div>
                        <span>Valor</span>
                        <strong>{formatCurrency(receipt.valor)}</strong>
                      </div>
                      <div>
                        <span>Confirmação</span>
                        <strong>{new Intl.DateTimeFormat('pt-BR').format(new Date(receipt.dataConfirmacao))}</strong>
                      </div>
                    </div>
                  )}
                  {error && <div className="generosidade-error">{error}</div>}
                  <button
                    type="button"
                    className="generosidade-secondary"
                    onClick={() => {
                      setCreatedDonation(null)
                      setReceipt(null)
                      setError(null)
                      setPixCopied(false)
                    }}
                  >
                    Fazer outra doação
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="generosidade-form">
                  <div className="generosidade-step">
                    <h3>1. Escolha a finalidade</h3>
                    {loading ? (
                      <div className="generosidade-loading">Carregando opções...</div>
                    ) : (
                      <div className="generosidade-finalidades">
                        {finalidades.map((item) => (
                          <button
                            type="button"
                            key={item.id ?? item.slug}
                            className={`generosidade-finalidade ${selectedFinalidade?.id === item.id ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedFinalidadeId(item.id)
                              setSelectedValue('')
                              setCustomValueCents(0)
                            }}
                            style={item.corHex ? { '--finalidade-color': item.corHex } : undefined}
                          >
                            <strong>{item.nome}</strong>
                            {item.descricaoPublica && <span>{item.descricaoPublica}</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="generosidade-step">
                    <h3>2. Informe o valor</h3>
                    <div className="generosidade-values">
                      {suggestedValues.map((value) => (
                        <button
                          type="button"
                          key={value}
                          className={Number(selectedValue) === Number(value) && customValueCents === 0 ? 'active' : ''}
                          onClick={() => {
                            setSelectedValue(String(value))
                            setCustomValueCents(0)
                          }}
                        >
                          {formatCurrency(value)}
                        </button>
                      ))}
                    </div>
                    <label className="generosidade-field">
                      <span>Outro valor</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={customValueDisplay}
                        onChange={(event) => {
                          setCustomValueCents(currencyToCents(event.target.value))
                          setSelectedValue('')
                        }}
                        placeholder="R$ 0,00"
                      />
                    </label>
                  </div>

                  <div className="generosidade-step">
                    <h3>3. Seus dados</h3>
                    <div className="generosidade-fields">
                      <label className="generosidade-field">
                        <span>Nome *</span>
                        <input name="nomeDoador" value={formData.nomeDoador} onChange={handleChange} placeholder="Seu nome" required />
                      </label>
                      <label className="generosidade-field">
                        <span>WhatsApp</span>
                        <input name="whatsApp" value={formData.whatsApp} onChange={handleChange} placeholder="(11) 99999-9999" />
                      </label>
                      <label className="generosidade-field">
                        <span>E-mail</span>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" />
                      </label>
                      <label className="generosidade-field">
                        <span>{paymentMethod === PAYMENT_METHOD.PIX ? 'CPF/CNPJ *' : 'CPF/CNPJ'}</span>
                        <input name="documento" value={formData.documento} onChange={handleChange} placeholder="000.000.000-00" required={paymentMethod === PAYMENT_METHOD.PIX} />
                      </label>
                    </div>
                    {selectedFinalidade?.permiteAnonimo !== false && (
                      <label className="generosidade-check">
                        <input type="checkbox" name="anonima" checked={formData.anonima} onChange={handleChange} />
                        <span>Não quero aparecer publicamente como doador</span>
                      </label>
                    )}
                  </div>

                  <div className="generosidade-step">
                    <h3>4. Forma de doação</h3>
                    <div className="generosidade-payment-methods">
                      {paymentMethods.map((method) => (
                        <button
                          type="button"
                          key={method.id}
                          disabled={!method.enabled}
                          className={paymentMethod === method.id ? 'active' : ''}
                          onClick={() => method.enabled && setPaymentMethod(method.id)}
                        >
                          {method.label}
                          {!method.enabled && <small>Em breve</small>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && <div className="generosidade-error">{error}</div>}

                  <button type="submit" className="generosidade-submit" disabled={submitting || loading}>
                    {submitting ? 'Iniciando doação...' : `Doar ${donationValue > 0 ? formatCurrency(donationValue) : ''}`}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Generosidade
