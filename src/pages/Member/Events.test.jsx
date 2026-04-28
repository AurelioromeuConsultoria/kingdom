import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Events from './Events'

const { mockUser, apiServiceMock } = vi.hoisted(() => ({
  mockUser: {
    nome: 'Marco Aurelio Soares',
    emailLogin: 'marco@igreja.com',
    whatsApp: '11999999999'
  },
  apiServiceMock: {
    getUpcomingEvents: vi.fn(),
    getMinhasInscricoesEventos: vi.fn(),
    createInscricaoEvento: vi.fn()
  }
}))

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: mockUser })
}))

vi.mock('../../services/api.service', () => ({
  default: apiServiceMock
}))

vi.mock('../../components/MemberArea/MemberAreaLayout', () => ({
  default: ({ title, children }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  )
}))

describe('Member Events', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mostra inscricao rapida para evento aberto sem inscricao previa', async () => {
    apiServiceMock.getUpcomingEvents.mockResolvedValue([
      {
        id: 10,
        titulo: 'Conferencia de Lideranca',
        descricao: 'Um encontro especial.',
        dataInicio: '2026-06-10T19:00:00',
        aceitaInscricoes: true
      }
    ])
    apiServiceMock.getMinhasInscricoesEventos.mockResolvedValue([])
    apiServiceMock.createInscricaoEvento.mockResolvedValue({ id: 1 })

    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    )

    expect(await screen.findByText('Conferencia de Lideranca')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Inscricao rapida' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Inscricao rapida' }))

    await waitFor(() => {
      expect(apiServiceMock.createInscricaoEvento).toHaveBeenCalledWith(expect.objectContaining({
        eventoId: 10,
        nome: 'Marco Aurelio Soares'
      }))
    })
  })
})
