import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../../services/api.service'
import Toast from '../../components/Toast/Toast'
import SEO from '../../components/SEO/SEO'
import '../../styles/shared-pages.css'
import './Contact.css'

function Contact() {
  const [churchInfo, setChurchInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nome: '',
    whatsApp: '',
    email: '',
    membro: '',
    mensagem: ''
  })
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [fieldErrors, setFieldErrors] = useState({
    nome: '',
    whatsApp: '',
    membro: '',
    mensagem: ''
  })

  useEffect(() => {
    loadChurchInfo()
  }, [])

  const loadChurchInfo = async () => {
    try {
      const info = await apiService.getChurchInfo()
      setChurchInfo(info)
    } catch (error) {
      console.error('Erro ao carregar informações da igreja:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatWhatsAppLink = (phone) => {
    if (!phone) return ''
    // Remove todos os caracteres não numéricos
    const numbers = phone.replace(/\D/g, '')
    // Se não começar com 55 (código do Brasil), adiciona
    if (numbers.length >= 10) {
      const phoneNumber = numbers.startsWith('55') ? numbers : `55${numbers}`
      return `https://wa.me/${phoneNumber}`
    }
    return `https://wa.me/55${numbers}`
  }

  const maskWhatsApp = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Aplica a máscara conforme o tamanho
    if (numbers.length <= 2) {
      return numbers
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    } else {
      // Limita a 11 dígitos (formato celular: (XX) XXXXX-XXXX)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }
  }

  const handleChange = (e) => {
    const target = e.target
    let value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    // Aplicar máscara se for o campo WhatsApp
    if (name === 'whatsApp') {
      value = maskWhatsApp(value)
    }

    setFormData({
      ...formData,
      [name]: value
    })
    // Limpar erro do campo ao editar
    if (name in fieldErrors && fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' })
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.nome.trim()) {
      errors.nome = 'Por favor, preencha o campo Nome.'
    }

    const whatsAppNumbers = formData.whatsApp.replace(/\D/g, '')
    if (!whatsAppNumbers || whatsAppNumbers.length < 10) {
      errors.whatsApp = 'Por favor, preencha o campo WhatsApp com um número válido.'
    }

    if (!formData.membro) {
      errors.membro = 'Por favor, selecione se é membro da igreja.'
    }

    if (!formData.mensagem.trim()) {
      errors.mensagem = 'Por favor, preencha o campo Mensagem.'
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setMessage({ type: '', text: '' })
    setFieldErrors({ nome: '', whatsApp: '', membro: '', mensagem: '' })

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(prev => ({ ...prev, ...errors }))
      setFormLoading(false)
      return
    }

    try {
      // Remover máscara do WhatsApp antes de enviar (apenas números)
      const whatsAppNumbers = formData.whatsApp.replace(/\D/g, '')
      
      await apiService.sendContact({
        nome: formData.nome,
        whatsApp: whatsAppNumbers,
        email: formData.email || null,
        membro: formData.membro === 'Sim',
        mensagem: formData.mensagem
      })
      setMessage({ type: 'success', text: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' })
      setFormData({ nome: '', whatsApp: '', email: '', membro: '', mensagem: '' })
      setFieldErrors({ nome: '', whatsApp: '', membro: '', mensagem: '' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao enviar mensagem. Por favor, tente novamente.' })
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="contact-page">
      <SEO
        title="Contato - Endereço e Horários"
        description="Entre em contato com a Kingdom em Guarulhos. Endereço, horários de culto, WhatsApp e formulário. Estamos à disposição."
        path="/contato"
      />
      {/* Page Title Start */}
      <section className="page-title-area">
        <div className="container">
          <h1 className="title">Entre em Contato Conosco</h1>
          <ul className="breadcrumb-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li className="active">Entre em Contato Conosco</li>
          </ul>
        </div>
      </section>
      {/* Page Title End */}

      {/* Contact Quick Info - Barra unificada */}
      <section className="contact-quick-info">
        <div className="container">
          <div className="contact-quick-grid">
            <a
              href={formatWhatsAppLink(churchInfo?.contact?.phone || '11 94793-4943')}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-quick-item"
            >
              <span className="contact-quick-icon">
                <i className="fa-brands fa-whatsapp"></i>
              </span>
              <span className="contact-quick-content">
                <span className="contact-quick-label">WhatsApp</span>
                <span className="contact-quick-value">
                  {loading ? 'Carregando...' : (churchInfo?.contact?.phone || '11 94793-4943')}
                </span>
              </span>
            </a>
            <a
              href={`mailto:${churchInfo?.contact?.email || 'contato@kingdombr.com.br'}`}
              className="contact-quick-item"
            >
              <span className="contact-quick-icon">
                <i className="fa-solid fa-envelope"></i>
              </span>
              <span className="contact-quick-content">
                <span className="contact-quick-label">Email</span>
                <span className="contact-quick-value">
                  {loading ? 'Carregando...' : (churchInfo?.contact?.email || 'contato@kingdombr.com.br')}
                </span>
              </span>
            </a>
            <a
              href={churchInfo?.socialMedia?.instagram || 'https://www.instagram.com/kingdom.gru'}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-quick-item"
            >
              <span className="contact-quick-icon">
                <i className="fa-brands fa-instagram"></i>
              </span>
              <span className="contact-quick-content">
                <span className="contact-quick-label">Instagram</span>
                <span className="contact-quick-value">@kingdom.gru</span>
              </span>
            </a>
            <div className="contact-quick-item contact-quick-item--static">
              <span className="contact-quick-icon">
                <i className="fa-solid fa-calendar-days"></i>
              </span>
              <span className="contact-quick-content">
                <span className="contact-quick-label">Dias de Reunião</span>
                <span className="contact-quick-value">
                  {loading ? 'Carregando...' : (churchInfo?.schedule?.meetings || churchInfo?.meetings || 'Domingos às 18:30')}
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Map Start */}
      <section className="contact-form-map-section section-gap soft-blue-bg">
        <div className="container">
          <div className="row align-items-stretch g-4">
            <div className="col-lg-6">
              <div className="contact-form-card">
                <div className="section-title text-left mb-45">
                  <span className="title-tag">Fale Conosco</span>
                  <h2 className="title">Oração, dúvidas e sugestões!</h2>
                </div>

                <div className="form-area">
                <form id="contact-form" onSubmit={handleSubmit}>
                  <div className={`input-group contact-field-wrapper ${fieldErrors.nome ? 'has-error' : ''}`}>
                    <input
                      type="text"
                      name="nome"
                      placeholder="Digite seu nome"
                      value={formData.nome}
                      onChange={handleChange}
                    />
                    <div className="icon">
                      <i className="fa-solid fa-user"></i>
                    </div>
                    {fieldErrors.nome && <span className="contact-field-error">{fieldErrors.nome}</span>}
                  </div>
                  <div className={`input-group mt-20 contact-field-wrapper ${fieldErrors.whatsApp ? 'has-error' : ''}`}>
                    <input
                      type="text"
                      name="whatsApp"
                      placeholder="(XX) XXXXX-XXXX"
                      value={formData.whatsApp}
                      onChange={handleChange}
                      maxLength={15}
                    />
                    <div className="icon">
                      <i className="fa-brands fa-whatsapp"></i>
                    </div>
                    {fieldErrors.whatsApp && <span className="contact-field-error">{fieldErrors.whatsApp}</span>}
                  </div>
                  <div className="input-group mt-20">
                    <input
                      type="email"
                      name="email"
                      placeholder="Digite seu email (opcional)"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <div className="icon">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                  </div>
                  <div className={`input-group mt-20 contact-field-wrapper contact-field-membro ${fieldErrors.membro ? 'has-error' : ''}`}>
                    <div
                      className="contact-field-membro-inner"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px',
                        minHeight: '56px',
                        padding: '0 16px',
                        width: '100%',
                        boxSizing: 'border-box',
                        backgroundColor: '#fff',
                        color: '#81a3bb',
                        border: 'none',
                        fontSize: '16px'
                      }}
                    >
                      <span style={{ color: '#81a3bb', fontSize: '16px', marginRight: '10px' }}>
                        É membro da igreja?
                      </span>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          margin: 0,
                          color: '#81a3bb',
                          fontSize: '16px'
                        }}
                      >
                        <input
                          type="radio"
                          name="membro"
                          value="Sim"
                          checked={formData.membro === 'Sim'}
                          onChange={handleChange}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer',
                            margin: 0,
                            accentColor: 'var(--primary-color)'
                          }}
                        />
                        <span>Sim</span>
                      </label>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          margin: 0,
                          color: '#81a3bb',
                          fontSize: '16px'
                        }}
                      >
                        <input
                          type="radio"
                          name="membro"
                          value="Não"
                          checked={formData.membro === 'Não'}
                          onChange={handleChange}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer',
                            margin: 0,
                            accentColor: 'var(--primary-color)'
                          }}
                        />
                        <span>Não</span>
                      </label>
                      <span className="icon icon-membro">
                        <i className="fa-solid fa-church"></i>
                      </span>
                    </div>
                    {fieldErrors.membro && <span className="contact-field-error">{fieldErrors.membro}</span>}
                  </div>
                  <div className={`input-group textarea-group mt-20 contact-field-wrapper ${fieldErrors.mensagem ? 'has-error' : ''}`}>
                    <textarea
                      name="mensagem"
                      id="mensagem"
                      cols="30"
                      rows="10"
                      placeholder="Digite sua mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                    ></textarea>
                    <div className="icon">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </div>
                    {fieldErrors.mensagem && <span className="contact-field-error">{fieldErrors.mensagem}</span>}
                  </div>
                  <div className="input-group mt-20">
                    <button className="main-btn" type="submit" disabled={formLoading}>
                      {formLoading ? 'Enviando...' : 'Enviar Agora'}
                    </button>
                  </div>
                </form>
              </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="contact-map-card">
                <h3 className="map-title">Nossa Localização</h3>
                <p className="map-address">
                  {loading ? 'Carregando...' : (churchInfo?.contact?.address || 'Av. Monte Alegre, 894 - Cidade Soberana, Guarulhos - SP, 07161-150')}
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Av.+Monte+Alegre,+894+-+Cidade+Soberana,+Guarulhos+-+SP,+07161-150"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link-btn"
                >
                  <i className="fa-solid fa-map-location-dot"></i>
                  Abrir no Google Maps
                </a>
                <div className="contact-map-embed">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.0745!2d-46.4398004!3d-23.399609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce8bd6061ea803%3A0xf82917fbad6dc320!2sAv.%20Monte%20Alegre%2C%20894%20-%20Cidade%20Soberana%2C%20Guarulhos%20-%20SP%2C%2007161-150!5e0!3m2!1spt-BR!2sbr!4v1709000000"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '350px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização Kingdom"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Contact Form and Map End */}

      {/* Toast Notification */}
      <Toast
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ type: '', text: '' })}
      />
    </div>
  )
}

export default Contact
