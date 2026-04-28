import { useState } from 'react'
import MemberAreaLayout from '../../components/MemberArea/MemberAreaLayout'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/api.service'
import './member-area.css'

function onlyDigits(value) {
  return (value || '').replace(/\D/g, '')
}

function maskPhone(value) {
  const numbers = onlyDigits(value)
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
}

function Prayer() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    nome: user?.nome || '',
    whatsApp: '',
    email: user?.email || user?.emailLogin || '',
    membro: true,
    mensagem: ''
  })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    const nextValue = type === 'checkbox' ? checked : value

    setForm((current) => ({
      ...current,
      [name]: name === 'whatsApp' ? maskPhone(nextValue) : nextValue
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFeedback({ type: '', message: '' })

    try {
      await apiService.sendContact({
        nome: form.nome,
        whatsApp: onlyDigits(form.whatsApp),
        email: form.email || null,
        membro: form.membro,
        mensagem: form.mensagem
      })
      setFeedback({ type: 'success', message: 'Seu pedido foi enviado com sucesso. A equipe vai acompanhar com cuidado.' })
      setForm((current) => ({
        ...current,
        mensagem: ''
      }))
    } catch {
      setFeedback({ type: 'error', message: 'Nao foi possivel enviar seu pedido agora. Tente novamente em instantes.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <MemberAreaLayout
      title="Pedidos de oracao"
      description="Uma camada simples e direta de cuidado pastoral dentro da area do membro, aproveitando o fluxo de contato que ja existe no sistema."
    >
      {feedback.message ? (
        <div className={`member-feedback ${feedback.type === 'error' ? 'member-feedback--error' : 'member-feedback--success'}`}>
          {feedback.message}
        </div>
      ) : null}

      <div className="member-card-grid member-card-grid--two">
        <div className="member-panel">
          <div className="member-panel__header">
            <div>
              <h2>Enviar pedido</h2>
              <p>Preenchemos o maximo possivel com sua conta, para reduzir atrito e tornar o cuidado mais acessivel.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="member-form-grid">
              <div className="member-field">
                <label htmlFor="nome">Nome</label>
                <input id="nome" name="nome" value={form.nome} onChange={handleChange} required />
              </div>

              <div className="member-field">
                <label htmlFor="whatsApp">WhatsApp</label>
                <input id="whatsApp" name="whatsApp" value={form.whatsApp} onChange={handleChange} placeholder="(11) 99999-9999" required />
              </div>

              <div className="member-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
              </div>

              <div className="member-field">
                <label htmlFor="membro">Membro da igreja</label>
                <select id="membro" name="membro" value={form.membro ? 'sim' : 'nao'} onChange={(event) => setForm((current) => ({ ...current, membro: event.target.value === 'sim' }))}>
                  <option value="sim">Sim</option>
                  <option value="nao">Nao</option>
                </select>
              </div>
            </div>

            <div className="member-field" style={{ marginTop: '16px' }}>
              <label htmlFor="mensagem">Como podemos orar por voce?</label>
              <textarea
                id="mensagem"
                name="mensagem"
                value={form.mensagem}
                onChange={handleChange}
                placeholder="Descreva aqui seu pedido com a profundidade que achar adequada."
                required
              />
            </div>

            <div className="member-inline-actions">
              <button type="submit" className="member-action-button" disabled={saving}>
                {saving ? 'Enviando...' : 'Enviar pedido de oracao'}
              </button>
            </div>
          </form>
        </div>

        <div className="member-panel">
          <div className="member-panel__header">
            <div>
              <h2>Como pensamos esse fluxo</h2>
              <p>Sem criar burocracia nem expor o membro a um formulario frio ou administrativo.</p>
            </div>
          </div>

          <div className="member-card-grid">
            <div className="member-highlight-card">
              <h3>Cuidado sem atrito</h3>
              <p>O pedido nasce dentro da area autenticada, sem exigir que voce repita tudo do zero.</p>
            </div>
            <div className="member-highlight-card">
              <h3>Base reaproveitada</h3>
              <p>Usamos o fluxo de contato que ja existe no Portal, mantendo o sistema coeso e mais simples de manter.</p>
            </div>
            <div className="member-highlight-card">
              <h3>Pronto para evoluir</h3>
              <p>Essa base pode virar uma frente mais completa de cuidado pastoral quando essa prioridade entrar na fila.</p>
            </div>
          </div>
        </div>
      </div>
    </MemberAreaLayout>
  )
}

export default Prayer
