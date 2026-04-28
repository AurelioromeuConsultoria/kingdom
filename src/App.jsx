import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import ProtectedRoute from './components/MemberArea/ProtectedRoute'

const Home = lazy(() => import('./pages/Home/Home'))
const About = lazy(() => import('./pages/About/About'))
const Ministries = lazy(() => import('./pages/Ministries/Ministries'))
const Voluntarios = lazy(() => import('./pages/Voluntarios/Voluntarios'))
const VoluntariosEquipes = lazy(() => import('./pages/Voluntarios/VoluntariosEquipes'))
const Servos = lazy(() => import('./pages/Servos/Servos'))
const Equipes = lazy(() => import('./pages/Servos/Equipes'))
const Kids = lazy(() => import('./pages/Kids/Kids'))
const Hub = lazy(() => import('./pages/Hub/Hub'))
const Events = lazy(() => import('./pages/Events/Events'))
const EventDetail = lazy(() => import('./pages/Events/EventDetail'))
const Contact = lazy(() => import('./pages/Contact/Contact'))
const Sermons = lazy(() => import('./pages/Sermons/Sermons'))
const Gallery = lazy(() => import('./pages/Gallery/Gallery'))
const GalleryDetail = lazy(() => import('./pages/Gallery/GalleryDetail'))
const Blog = lazy(() => import('./pages/Blog/Blog'))
const BlogDetail = lazy(() => import('./pages/Blog/BlogDetail'))
const Generosidade = lazy(() => import('./pages/Generosidade/Generosidade'))
const Leadership = lazy(() => import('./pages/Leadership/Leadership'))
const LeaderDetail = lazy(() => import('./pages/Leadership/LeaderDetail'))
const CadastroMembro = lazy(() => import('./pages/CadastroMembro/CadastroMembro'))
const MemberLogin = lazy(() => import('./pages/Member/Login'))
const MemberDashboard = lazy(() => import('./pages/Member/Dashboard'))
const MemberProfile = lazy(() => import('./pages/Member/Profile'))
const MemberScales = lazy(() => import('./pages/Member/Scales'))
const MemberEvents = lazy(() => import('./pages/Member/Events'))
const MemberNotifications = lazy(() => import('./pages/Member/Notifications'))
const MemberFamily = lazy(() => import('./pages/Member/Family'))
const MemberPrayer = lazy(() => import('./pages/Member/Prayer'))
const NotFound = lazy(() => import('./pages/NotFound/NotFound'))

function RouteLoader() {
  return (
    <section className="member-shell">
      <div className="container">
        <div className="member-state-card">
          <h2>Carregando página</h2>
          <p>Estamos preparando esta área para você.</p>
        </div>
      </div>
    </section>
  )
}

function App() {
  const location = useLocation()
  const standaloneCadastro = location.pathname === '/cadastro'

  if (standaloneCadastro) {
    return (
      <ErrorBoundary>
        <Routes>
          <Route path="/cadastro" element={<CadastroMembro />} />
        </Routes>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/ministerios" element={<Ministries />} />
        <Route path="/voluntarios" element={<Voluntarios />} />
        <Route path="/voluntarios/equipes" element={<VoluntariosEquipes />} />
        <Route path="/servos" element={<Servos />} />
        <Route path="/servos/equipes" element={<Equipes />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/hub" element={<Hub />} />
        <Route path="/eventos" element={<Events />} />
        <Route path="/eventos/:id" element={<EventDetail />} />
        <Route path="/sermoes" element={<Sermons />} />
        <Route path="/galeria" element={<Gallery />} />
        <Route path="/galeria/:id" element={<GalleryDetail />} />
        <Route path="/noticias" element={<Blog />} />
        <Route path="/noticias/:id" element={<BlogDetail />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/generosidade" element={<Generosidade />} />
        <Route path="/lideranca" element={<Leadership />} />
        <Route path="/lideranca/:slug" element={<LeaderDetail />} />
        <Route path="/area-do-membro/login" element={<MemberLogin />} />
        <Route
          path="/area-do-membro"
          element={(
            <ProtectedRoute>
              <MemberDashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/area-do-membro/perfil"
          element={(
            <ProtectedRoute>
              <MemberProfile />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/area-do-membro/escalas"
          element={(
            <ProtectedRoute>
              <MemberScales />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/area-do-membro/eventos"
          element={(
            <ProtectedRoute>
              <MemberEvents />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/area-do-membro/notificacoes"
          element={(
            <ProtectedRoute>
              <MemberNotifications />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/area-do-membro/familia"
          element={(
            <ProtectedRoute>
              <MemberFamily />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/area-do-membro/oracao"
          element={(
            <ProtectedRoute>
              <MemberPrayer />
            </ProtectedRoute>
          )}
        />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  )
}

export default App
