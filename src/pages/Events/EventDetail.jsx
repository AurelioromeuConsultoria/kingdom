import { useEffect, useState, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import apiService from '../../services/api.service'
import SEO from '../../components/SEO/SEO'
import { JsonLdEvent } from '../../components/SEO/JsonLd'
import '../../styles/shared-pages.css'
import './Events.css'

const CAMPOS_PADRAO = [
  { slug: 'nome', label: 'Nome completo', tipo: 'texto', obrigatorio: true },
  { slug: 'whatsApp', label: 'WhatsApp', tipo: 'texto', obrigatorio: true },
  { slug: 'email', label: 'Email', tipo: 'texto', obrigatorio: false },
  { slug: 'observacoes', label: 'Observações', tipo: 'texto', obrigatorio: false }
]

function parseConfiguracaoFormulario(event) {
  const e = event?.dto ?? event
  const raw = e?.configuracaoFormularioInscricao ?? e?.ConfiguracaoFormularioInscricao
  if (!raw || typeof raw !== 'string') return CAMPOS_PADRAO
  try {
    const arr = JSON.parse(raw)
    if (Array.isArray(arr) && arr.length > 0) return arr
  } catch (_) {}
  return CAMPOS_PADRAO
}

function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [galerias, setGalerias] = useState([])
  const [loading, setLoading] = useState(true)
  const [showInscricaoModal, setShowInscricaoModal] = useState(false)
  const [inscricaoEnviada, setInscricaoEnviada] = useState(false)
  const [inscricaoErro, setInscricaoErro] = useState('')
  const [inscricaoLoading, setInscricaoLoading] = useState(false)
  const [formInscricao, setFormInscricao] = useState({})
  const [inscricaoFieldErrors, setInscricaoFieldErrors] = useState({})

  const camposFormulario = useMemo(() => (event ? parseConfiguracaoFormulario(event) : CAMPOS_PADRAO), [event])

  useEffect(() => {
    if (id) loadEvent()
  }, [id])

  useEffect(() => {
    if (showInscricaoModal) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [showInscricaoModal])

  const loadEvent = async () => {
    try {
      setLoading(true)
      const [eventData, galeriasData] = await Promise.all([
        apiService.getEventById(id),
        apiService.getGaleriasByEvento(id).catch(() => [])
      ])
      setEvent(eventData)
      setGalerias(Array.isArray(galeriasData) ? galeriasData : [])
    } catch (error) {
      console.error('Erro ao carregar evento:', error)
      if (error.response?.status === 404) {
        navigate('/eventos')
      } else {
        setEvent(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch (error) {
      return dateString
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return ''
    try {
      if (timeString.includes(':')) {
        const parts = timeString.split(':')
        return `${parts[0]}:${parts[1]}`
      }
      return timeString
    } catch (error) {
      return timeString
    }
  }

  const getImageUrl = (imagem) => {
    if (!imagem) return '/images/conference.png'
    return apiService.getImageUrl(imagem) || '/images/conference.png'
  }

  const titulo = event?.titulo ?? event?.title ?? 'Evento'
  const descricao = event?.descricao ?? event?.description ?? ''
  const imagem = event?.imagemDestaque ?? event?.ImagemDestaque ?? event?.imagem ?? event?.image
  const aceitaInscricoes = event?.aceitaInscricoes ?? event?.AceitaInscricoes ?? false

  const handleInscricaoChange = (slug, value, isNumber) => {
    setFormInscricao((prev) => ({
      ...prev,
      [slug]: isNumber ? (parseInt(value, 10) || 0) : value
    }))
    setInscricaoErro('')
    if (inscricaoFieldErrors[slug]) {
      setInscricaoFieldErrors((prev) => ({ ...prev, [slug]: '' }))
    }
  }

  const formatWhatsApp = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      if (numbers.length <= 2) return numbers
      if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    }
    return value
  }

  const validateInscricaoForm = () => {
    const errors = {}
    camposFormulario.forEach((c) => {
      const slug = (c.slug || '').trim()
      if (!slug) return
      const val = formInscricao[slug]
      const str = typeof val === 'string' ? val.trim() : String(val ?? '')
      if (c.obrigatorio) {
        if (c.tipo === 'numero') {
          if (str === '' || (parseInt(str, 10) || 0) < 0) errors[slug] = `O campo "${c.label}" é obrigatório.`
        } else if (!str) {
          errors[slug] = `Por favor, preencha o campo ${c.label}.`
        }
      }
      if (slug.toLowerCase() === 'whatsapp' && str) {
        const numbers = str.replace(/\D/g, '')
        if (numbers.length < 10) errors[slug] = 'Por favor, preencha o WhatsApp com um número válido.'
        else if (numbers.length > 13) errors[slug] = 'WhatsApp inválido. Use o formato (11) 99999-9999'
      }
      if ((slug.toLowerCase() === 'email' || c.tipo === 'email') && str && !/.+@.+\..+/.test(str)) {
        errors[slug] = 'Por favor, informe um email válido.'
      }
    })
    return errors
  }

  const handleInscricaoSubmit = async (e) => {
    e.preventDefault()
    setInscricaoErro('')
    setInscricaoFieldErrors({})
    const errors = validateInscricaoForm()
    if (Object.keys(errors).length > 0) {
      setInscricaoFieldErrors(errors)
      return
    }
    try {
      setInscricaoLoading(true)
      const fixedSlugsLower = ['nome', 'whatsapp', 'email', 'observacoes']
      const campos = {}
      camposFormulario.forEach((c) => {
        const slug = (c.slug || '').trim()
        if (!slug) return
        const key = slug.toLowerCase()
        if (fixedSlugsLower.includes(key)) return
        const val = formInscricao[slug]
        if (val !== undefined && val !== null && val !== '') campos[slug] = val
      })
      const whatsAppVal = formInscricao.whatsApp ?? formInscricao.WhatsApp ?? ''
      const payload = {
        eventoId: Number(id),
        nome: (formInscricao.nome ?? formInscricao.Nome ?? '').toString().trim(),
        whatsApp: typeof whatsAppVal === 'string' ? whatsAppVal.replace(/\D/g, '') : String(whatsAppVal || '').replace(/\D/g, ''),
        email: (formInscricao.email ?? formInscricao.Email ?? '')?.toString().trim() || null,
        observacoes: (formInscricao.observacoes ?? formInscricao.Observacoes ?? '')?.toString().trim() || null
      }
      if (Object.keys(campos).length > 0) payload.campos = campos
      await apiService.createInscricaoEvento(payload)
      setInscricaoEnviada(true)
      setFormInscricao(getInitialFormInscricao())
      setInscricaoFieldErrors({})
    } catch (err) {
      const msg = err.response?.data?.message
      if (typeof msg === 'string') {
        if (msg.includes('já iniciou')) setInscricaoErro('Este evento já iniciou e não aceita mais inscrições')
        else if (msg.includes('não aceita')) setInscricaoErro('Este evento não aceita inscrições')
        else if (msg.includes('já existe') || msg.includes('duplicada')) setInscricaoErro('Você já está inscrito neste evento')
        else if (msg.includes('não encontrado')) setInscricaoErro('Evento não encontrado')
        else setInscricaoErro(msg)
      } else setInscricaoErro('Erro ao realizar inscrição')
    } finally {
      setInscricaoLoading(false)
    }
  }

  const getInitialFormInscricao = () => {
    const initial = {}
    camposFormulario.forEach((c) => {
      const slug = (c.slug || '').trim() || 'campo'
      initial[slug] = c.tipo === 'numero' ? 0 : ''
    })
    return initial
  }

  const openInscricaoModal = () => {
    setInscricaoErro('')
    setInscricaoEnviada(false)
    setFormInscricao(getInitialFormInscricao())
    setInscricaoFieldErrors({})
    setShowInscricaoModal(true)
  }

  const closeInscricaoModal = () => {
    setShowInscricaoModal(false)
    setInscricaoErro('')
    setInscricaoFieldErrors({})
    setFormInscricao({})
  }

  if (loading) {
    return (
      <div className="events-page">
        <section className="page-title-area">
          <div className="container">
            <h2 className="title">Carregando...</h2>
            <ul className="breadcrumb-nav">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/eventos">Eventos</Link></li>
              <li className="active">Detalhe</li>
            </ul>
          </div>
        </section>
        <section className="section-pad-top-bottom">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <p>Carregando evento...</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!event) {
    return null
  }

  const eventImageUrl = imagem ? getImageUrl(imagem) : undefined
  const eventDescriptionSEO = (descricao || titulo).slice(0, 160)

  return (
    <div className="events-page">
      <SEO
        title={titulo}
        description={eventDescriptionSEO}
        path={`/eventos/${id}`}
        image={eventImageUrl}
      />
      <JsonLdEvent event={event} imageUrl={eventImageUrl} />
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">{titulo}</h2>
          <ul className="breadcrumb-nav">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/eventos">Eventos</Link></li>
            <li className="active">{titulo}</li>
          </ul>
        </div>
      </section>

      <section className="section-pad-top-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="testimonial-box-two mb-30">
                <div className="testimonial-inner">
                  <div className="testimonial-img">
                    <img
                      src={getImageUrl(imagem)}
                      alt={titulo}
                      loading="lazy"
                    />
                  </div>
                  <div className="content">
                    <h2>{titulo}</h2>
                    {descricao && <p className="mb-4">{descricao}</p>}
                    <ul className="categories">
                      {(event.dataInicio || event.data || event.date) && (
                        <li>
                          <span>
                            <i className="fa-solid fa-calendar-days"></i> Data:{' '}
                            {formatDate(event.dataInicio || event.data || event.date)}
                          </span>
                        </li>
                      )}
                      {(event.horaInicio || event.horarioInicio || event.startTime) && (
                        <li>
                          <span>
                            <i className="fa-solid fa-clock"></i> Início:{' '}
                            {formatTime(event.horaInicio || event.horarioInicio || event.startTime)}
                          </span>
                        </li>
                      )}
                      {(event.horaFim || event.horarioFim || event.endTime) && (
                        <li>
                          <span>
                            <i className="fa-solid fa-clock"></i> Término:{' '}
                            {formatTime(event.horaFim || event.horarioFim || event.endTime)}
                          </span>
                        </li>
                      )}
                    </ul>
                    {aceitaInscricoes && (
                      <div className="readmorebtn mb-2">
                        <button
                          type="button"
                          className="main-btn small-size"
                          onClick={openInscricaoModal}
                        >
                          <i className="fa-solid fa-pen-to-square me-2"></i>
                          Inscreva-se neste evento
                        </button>
                      </div>
                    )}
                    <div className="author mt-4">
                      <div className="readmorebtn">
                        <Link to="/eventos">
                          <i className="fa-solid fa-arrow-left"></i> Voltar aos Eventos
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {galerias.length > 0 && (
            <div className="row mt-5">
              <div className="col-12">
                <h3 className="mb-4">Galerias de fotos deste evento</h3>
                <div className="row">
                  {galerias.map((galeria) => (
                    <div key={galeria.id} className="col-lg-4 col-md-6 mb-4">
                      <Link to={`/galeria/${galeria.id}`} className="text-decoration-none">
                        <div className="testimonial-box-two h-100">
                          <div className="testimonial-inner">
                            <div className="content">
                              <h5>{galeria.nome}</h5>
                              {galeria.quantidadeFotos != null && (
                                <p className="text-muted small mb-0">
                                  <i className="fa-solid fa-images"></i> {galeria.quantidadeFotos} fotos
                                </p>
                              )}
                              <span className="readmorebtn small">
                                Ver galeria <i className="fa-solid fa-arrow-right"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {showInscricaoModal && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ position: 'fixed', inset: 0, zIndex: 1040, backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={closeInscricaoModal}
            aria-hidden="true"
          />
          <div
            className="modal fade show"
            style={{ display: 'block', position: 'fixed', inset: 0, zIndex: 1050, overflowX: 'hidden', overflowY: 'auto' }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalInscricaoTitle"
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h5 className="modal-title" id="modalInscricaoTitle">Inscreva-se neste evento</h5>
                  <button type="button" className="btn-close" onClick={closeInscricaoModal} aria-label="Fechar" />
                </div>
                <div className="modal-body">
                  {inscricaoEnviada ? (
                    <div className="alert alert-success mb-0">
                      <i className="fa-solid fa-check-circle me-2"></i>
                      Inscrição realizada com sucesso! Aguarde a confirmação.
                    </div>
                  ) : (
                    <form onSubmit={handleInscricaoSubmit}>
                      {inscricaoErro && <div className="alert alert-danger mb-3">{inscricaoErro}</div>}
                      {camposFormulario.map((c) => {
                        const slug = (c.slug || '').trim() || 'campo'
                        const isWhatsApp = slug.toLowerCase() === 'whatsapp'
                        const value = formInscricao[slug] ?? ''
                        const hasError = Boolean(inscricaoFieldErrors[slug])
                        const inputId = `inscricao-${slug}`
                        const label = c.obrigatorio ? `${c.label} *` : c.label
                        let input
                        if (c.tipo === 'numero') {
                          input = (
                            <input
                              type="number"
                              id={inputId}
                              className="form-control"
                              min="0"
                              value={value}
                              onChange={(e) => handleInscricaoChange(slug, e.target.value, true)}
                            />
                          )
                        } else if (slug.toLowerCase() === 'observacoes' || (c.tipo === 'texto' && c.label?.toLowerCase().includes('observa'))) {
                          input = (
                            <textarea
                              id={inputId}
                              className="form-control"
                              rows={3}
                              value={value}
                              onChange={(e) => handleInscricaoChange(slug, e.target.value, false)}
                              placeholder="Alguma informação adicional?"
                            />
                          )
                        } else {
                          const type = c.tipo === 'email' ? 'email' : c.tipo === 'tel' ? 'tel' : 'text'
                          input = (
                            <input
                              type={type}
                              id={inputId}
                              className="form-control"
                              value={value}
                              onChange={(e) => {
                                const v = isWhatsApp ? formatWhatsApp(e.target.value) : e.target.value
                                handleInscricaoChange(slug, v, false)
                              }}
                              placeholder={isWhatsApp ? '(11) 99999-9999' : undefined}
                            />
                          )
                        }
                        return (
                          <div key={slug} className={`mb-3 event-inscricao-field ${hasError ? 'has-error' : ''}`}>
                            <label htmlFor={inputId} className="form-label">{label}</label>
                            {input}
                            {inscricaoFieldErrors[slug] && <span className="event-inscricao-field-error">{inscricaoFieldErrors[slug]}</span>}
                          </div>
                        )
                      })}
                      <div className="event-inscricao-modal-buttons">
                        <button type="submit" className="main-btn small-size" disabled={inscricaoLoading}>
                          {inscricaoLoading ? 'Enviando...' : 'Inscrever-se'}
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={closeInscricaoModal}>Cancelar</button>
                      </div>
                    </form>
                  )}
                </div>
                {inscricaoEnviada && (
                  <div className="modal-footer">
                    <button type="button" className="main-btn small-size" onClick={closeInscricaoModal}>Fechar</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default EventDetail
