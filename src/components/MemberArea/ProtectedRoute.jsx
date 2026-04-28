import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <section className="member-shell">
        <div className="container">
          <div className="member-state-card">
            <h2>Carregando sua área</h2>
            <p>Estamos preparando sua experiência autenticada.</p>
          </div>
        </div>
      </section>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/area-do-membro/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
