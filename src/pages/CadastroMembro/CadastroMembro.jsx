import { useState } from 'react'
import apiService from '../../services/api.service'
import SEO from '../../components/SEO/SEO'
import './CadastroMembro.css'

function CadastroMembro() {
  const [formData, setFormData] = useState({
    nome: '',
    whatsApp: '',
    email: '',
    dataNascimento: ''
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [warnings, setWarnings] = useState([])

  const maskWhatsApp = (value) => {
    const nums = value.replace(/\D/g, '')
    if (nums.length <= 2) return nums
    if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7, 11)}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const newValue = name === 'whatsApp' ? maskWhatsApp(value) : value
    setFormData(prev => ({ ...prev, [name]: newValue }))
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }))
    setSuccessMsg('')
    setSubmitError('')
    setWarnings([])
  }

  const validate = () => {
    const errors = {}

    if (!formData.nome.trim()) errors.nome = 'Informe seu nome'
    else if (formData.nome.trim().length < 3) errors.nome = 'Nome deve ter pelo menos 3 caracteres'

    const whatsapp = formData.whatsApp.replace(/\D/g, '')
    if (!whatsapp || whatsapp.length < 10) errors.whatsApp = 'Informe o WhatsApp com DDD'
    else if (whatsapp.length > 13) errors.whatsApp = 'WhatsApp inválido'

    if (!formData.email.trim()) errors.email = 'Informe seu email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email inválido'

    if (!formData.dataNascimento) {
      errors.dataNascimento = 'Informe a data de nascimento'
    } else {
      const d = new Date(formData.dataNascimento)
      if (d > new Date()) errors.dataNascimento = 'Data não pode ser futura'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate() || loading) return

    setLoading(true)
    setSuccessMsg('')
    setSubmitError('')
    setWarnings([])

    const payload = {
      nome: formData.nome.trim(),
      whatsApp: formData.whatsApp.replace(/\D/g, ''),
      email: formData.email.trim(),
      dataNascimento: formData.dataNascimento || null
    }
    if (payload.dataNascimento) {
      payload.dataNascimento = new Date(payload.dataNascimento).toISOString()
    }

    try {
      const data = await apiService.cadastrarMembro(payload)
      const msg = data.mensagem || data.Mensagem || 'Cadastro realizado com sucesso!'
      setSuccessMsg(msg)
      setWarnings(data.avisos || data.Avisos || [])
      setFormData({ nome: '', whatsApp: '', email: '', dataNascimento: '' })
      setFieldErrors({})
    } catch (err) {
      const msg = err.response?.data?.mensagem || err.response?.data?.Mensagem || 'Erro ao cadastrar. Tente novamente.'
      setSubmitError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cadastro-membro-page">
      <SEO
        title="Cadastro de Membro"
        description="Cadastre-se como membro da Kingdom em Guarulhos. Preencha seus dados e faça parte da nossa comunidade."
        path="/cadastro"
        noIndex
      />
      <div className="cadastro-membro-container">
        <img
          src="/images/logo.png"
          alt="Kingdom"
          className="cadastro-membro-logo"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextElementSibling?.classList.add('visible')
          }}
        />
        <svg
          className="cadastro-membro-logo-svg"
          viewBox="0 0 180 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <text x="0" y="35" fontFamily="Georgia, serif" fontSize="32" fontWeight="600" fill="var(--cadastro-primary)">
            Kingdom
          </text>
        </svg>

        <h1 className="cadastro-membro-title">Cadastro de Membro</h1>
        <p className="cadastro-membro-subtitle">Preencha seus dados para fazer parte do nosso cadastro</p>

        {successMsg && (
          <div className="cadastro-membro-success">{successMsg}</div>
        )}

        {submitError && (
          <div className="cadastro-membro-submit-error">{submitError}</div>
        )}

        {warnings.length > 0 && (
          <div className="cadastro-membro-warning">
            {warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="cadastro-membro-form" noValidate>
          <div className="cadastro-membro-field">
            <label htmlFor="nome">Nome completo <span className="required">*</span></label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Seu nome completo"
              value={formData.nome}
              onChange={handleChange}
              maxLength={100}
              autoComplete="name"
              className={fieldErrors.nome ? 'error' : ''}
            />
            {fieldErrors.nome && <span className="cadastro-membro-error">{fieldErrors.nome}</span>}
          </div>

          <div className="cadastro-membro-field">
            <label htmlFor="whatsApp">WhatsApp <span className="required">*</span></label>
            <input
              type="tel"
              id="whatsApp"
              name="whatsApp"
              placeholder="(11) 99999-9999"
              value={formData.whatsApp}
              onChange={handleChange}
              autoComplete="tel"
              className={fieldErrors.whatsApp ? 'error' : ''}
            />
            {fieldErrors.whatsApp && <span className="cadastro-membro-error">{fieldErrors.whatsApp}</span>}
            <p className="cadastro-membro-hint">Com DDD</p>
          </div>

          <div className="cadastro-membro-field">
            <label htmlFor="email">Email <span className="required">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="seu@email.com"
              required
              value={formData.email}
              onChange={handleChange}
              maxLength={100}
              autoComplete="email"
              className={fieldErrors.email ? 'error' : ''}
            />
            {fieldErrors.email && <span className="cadastro-membro-error">{fieldErrors.email}</span>}
          </div>

          <div className="cadastro-membro-field">
            <label htmlFor="dataNascimento">Data de nascimento <span className="required">*</span></label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              required
              className={fieldErrors.dataNascimento ? 'error' : ''}
            />
            {fieldErrors.dataNascimento && <span className="cadastro-membro-error">{fieldErrors.dataNascimento}</span>}
          </div>

          <button type="submit" disabled={loading} className="cadastro-membro-btn">
            {loading ? 'Enviando...' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CadastroMembro
