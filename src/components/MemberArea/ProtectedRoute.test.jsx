import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const authState = {
  isAuthenticated: false,
  loading: false
}

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => authState
}))

function renderRoute(initialEntry = '/area-do-membro') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/area-do-membro"
          element={(
            <ProtectedRoute>
              <div>Conteudo protegido</div>
            </ProtectedRoute>
          )}
        />
        <Route path="/area-do-membro/login" element={<div>Tela de login</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('redireciona para login quando nao autenticado', async () => {
    authState.isAuthenticated = false
    authState.loading = false

    renderRoute()

    expect(await screen.findByText('Tela de login')).toBeInTheDocument()
  })

  it('renderiza o conteudo quando autenticado', async () => {
    authState.isAuthenticated = true
    authState.loading = false

    renderRoute()

    expect(await screen.findByText('Conteudo protegido')).toBeInTheDocument()
  })
})
