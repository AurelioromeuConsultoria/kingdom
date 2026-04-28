import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MemberAreaLayout from '../../components/MemberArea/MemberAreaLayout'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/api.service'
import './member-area.css'

const CANAIS = [
  { value: 1, label: 'WhatsApp', hint: 'Lembretes, avisos rapidos e comunicacao direta.' },
  { value: 2, label: 'E-mail', hint: 'Conteudos mais completos e comunicados formais.' },
  { value: 3, label: 'Push', hint: 'Notificacoes instantaneas no dispositivo.' },
  { value: 4, label: 'Notificacao interna', hint: 'Mensagens que ficam visiveis dentro do sistema.' }
]

function Profile() {
  const { user } = useAuth()
  const [pessoa360, setPessoa360] = useState(null)
  const [pessoa, setPessoa] = useState(null)
  const [preferencias, setPreferencias] = useState([])
  const [perfilForm, setPerfilForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    whatsApp: '',
    dataNascimento: ''
  })
  const [senhaForm, setSenhaForm] = useState({
    senhaAtual: '',
    novaSenha: ''
  })
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        const [pessoaData, preferenciasData] = await Promise.all([
          apiService.getPessoa360(user.pessoaId).catch(() => null),
          apiService.getMinhaPessoa().catch(() => null),
          apiService.getPreferenciasComunicacao(user.pessoaId).catch(() => [])
        ])

        if (!active) return
        setPessoa360(pessoaData)
        const pessoaAtual = pessoaData?.pessoa || pessoaData || null
        setPessoa(pessoaAtual)
        if (pessoaAtual) {
          setPerfilForm({
            nome: pessoaAtual.nome || '',
            email: pessoaAtual.email || '',
            telefone: pessoaAtual.telefone || '',
            whatsApp: pessoaAtual.whatsApp || '',
            dataNascimento: pessoaAtual.dataNascimento ? String(pessoaAtual.dataNascimento).slice(0, 10) : ''
          })
        }
        setPreferencias(Array.isArray(preferenciasData) ? preferenciasData : [])
      } catch {
        // Tela segue util mesmo sem todos os blocos
      }
    }

    if (user?.pessoaId) {
      loadData()
    }

    return () => { active = false }
  }, [user?.pessoaId])

  const perfis = useMemo(() => (
    Array.isArray(pessoa360?.perfis)
      ? pessoa360.perfis.map((perfil) => perfil.nome || perfil.perfil || perfil.tipo || '').filter(Boolean)
      : []
  ), [pessoa360])

  const handleSenhaChange = (event) => {
    const { name, value } = event.target
    setSenhaForm((current) => ({ ...current, [name]: value }))
  }

  const handlePerfilChange = (event) => {
    const { name, value } = event.target
    setPerfilForm((current) => ({ ...current, [name]: value }))
  }

  const handleSalvarPerfil = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFeedback({ type: '', message: '' })

    try {
      const updated = await apiService.atualizarMinhaPessoa({
        nome: perfilForm.nome,
        email: perfilForm.email || null,
        telefone: perfilForm.telefone || null,
        whatsApp: perfilForm.whatsApp || null,
        dataNascimento: perfilForm.dataNascimento || null
      })
      setPessoa(updated)
      setFeedback({ type: 'success', message: 'Seus dados foram atualizados com sucesso.' })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error?.response?.data?.message || 'Nao foi possivel salvar seu cadastro agora.'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAlterarSenha = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFeedback({ type: '', message: '' })

    try {
      await apiService.alterarSenha(senhaForm)
      setSenhaForm({ senhaAtual: '', novaSenha: '' })
      setFeedback({ type: 'success', message: 'Senha atualizada com sucesso.' })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error?.response?.data || 'Nao foi possivel atualizar sua senha agora.'
      })
    } finally {
      setSaving(false)
    }
  }

  const togglePreferencia = async (canal) => {
    const atual = preferencias.find((item) => item.canal === canal)
    const proximoStatus = atual?.status === 1 ? 2 : 1

    try {
      const updated = await apiService.atualizarPreferenciaComunicacao(user.pessoaId, canal, {
        status: proximoStatus,
        origemConsentimento: 'PortalAreaMembro'
      })

      setPreferencias((current) => {
        const others = current.filter((item) => item.canal !== canal)
        return [...others, updated]
      })
    } catch {
      setFeedback({ type: 'error', message: 'Nao foi possivel atualizar sua preferencia agora.' })
    }
  }

  const statusPermitido = (canal) => {
    const item = preferencias.find((preferencia) => preferencia.canal === canal)
    return !item || item.status === 1
  }

  return (
    <MemberAreaLayout
      title="Meu perfil"
      description="Aqui comeca a base do autosservico: seus dados principais, seguranca da conta e preferencia de comunicacao."
      actions={
        <Link to="/area-do-membro/oracao" className="member-action-button--ghost">
          Pedidos de oracao
        </Link>
      }
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
              <h2>Meu cadastro</h2>
              <p>Agora essa area ja permite editar os dados basicos da propria pessoa, sem depender do admin.</p>
            </div>
          </div>

          <form onSubmit={handleSalvarPerfil}>
            <div className="member-form-grid">
              <div className="member-field">
                <label htmlFor="nome">Nome</label>
                <input id="nome" name="nome" value={perfilForm.nome} onChange={handlePerfilChange} required />
              </div>
              <div className="member-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={perfilForm.email} onChange={handlePerfilChange} />
              </div>
              <div className="member-field">
                <label htmlFor="telefone">Telefone</label>
                <input id="telefone" name="telefone" value={perfilForm.telefone} onChange={handlePerfilChange} />
              </div>
              <div className="member-field">
                <label htmlFor="whatsApp">WhatsApp</label>
                <input id="whatsApp" name="whatsApp" value={perfilForm.whatsApp} onChange={handlePerfilChange} />
              </div>
              <div className="member-field">
                <label htmlFor="dataNascimento">Data de nascimento</label>
                <input id="dataNascimento" name="dataNascimento" type="date" value={perfilForm.dataNascimento} onChange={handlePerfilChange} />
              </div>
            </div>

            <div className="member-inline-actions">
              <button type="submit" className="member-action-button" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar cadastro'}
              </button>
            </div>
          </form>
        </div>

        <div className="member-panel">
          <div className="member-panel__header">
            <div>
              <h2>Resumo da conta</h2>
              <p>Contexto autenticado e perfis que hoje ja fazem parte da sua jornada no sistema.</p>
            </div>
          </div>

          <div className="member-profile-grid">
            <div className="member-highlight-card">
              <h3>Email de login</h3>
              <p>{user?.emailLogin || user?.email || 'Nao informado'}</p>
            </div>
            <div className="member-highlight-card">
              <h3>Tipo de usuario</h3>
              <p>{user?.tipoUsuarioDescricao || 'Conta autenticada'}</p>
            </div>
            <div className="member-highlight-card">
              <h3>Perfil de acesso</h3>
              <p>{user?.perfilAcessoNome || 'Nao definido'}</p>
            </div>
            <div className="member-highlight-card">
              <h3>Tipo de pessoa</h3>
              <p>{pessoa?.tipoPessoaDescricao || 'Nao informado'}</p>
            </div>
          </div>

          {perfis.length > 0 ? (
            <>
              <p className="member-page-note">Perfis vinculados a sua pessoa no sistema.</p>
              <ul className="member-muted-list">
                {perfis.map((perfil) => <li key={perfil}>{perfil}</li>)}
              </ul>
            </>
          ) : null}
        </div>

        <div className="member-panel">
          <div className="member-panel__header">
            <div>
              <h2>Seguranca da conta</h2>
              <p>Comecamos com a troca de senha, sem misturar isso com configuracoes do admin.</p>
            </div>
          </div>

          <form onSubmit={handleAlterarSenha}>
            <div className="member-form-grid">
              <div className="member-field">
                <label htmlFor="senhaAtual">Senha atual</label>
                <input
                  id="senhaAtual"
                  name="senhaAtual"
                  type="password"
                  value={senhaForm.senhaAtual}
                  onChange={handleSenhaChange}
                  required
                />
              </div>

              <div className="member-field">
                <label htmlFor="novaSenha">Nova senha</label>
                <input
                  id="novaSenha"
                  name="novaSenha"
                  type="password"
                  value={senhaForm.novaSenha}
                  onChange={handleSenhaChange}
                  required
                />
              </div>
            </div>

            <div className="member-inline-actions">
              <button type="submit" className="member-action-button" disabled={saving}>
                {saving ? 'Salvando...' : 'Atualizar senha'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="member-panel">
        <div className="member-panel__header">
          <div>
            <h2>Preferencias de comunicacao</h2>
            <p>Essa base ja conversa com a frente futura de comunicacao omnichannel.</p>
          </div>
        </div>

        <div className="member-switch-list">
          {CANAIS.map((canal) => (
            <div className="member-switch" key={canal.value}>
              <div className="member-switch__text">
                <strong>{canal.label}</strong>
                <span>{canal.hint}</span>
              </div>
              <input
                className="member-toggle"
                type="checkbox"
                checked={statusPermitido(canal.value)}
                onChange={() => togglePreferencia(canal.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </MemberAreaLayout>
  )
}

export default Profile
