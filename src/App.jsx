import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Ministries from './pages/Ministries/Ministries'
import Voluntarios from './pages/Voluntarios/Voluntarios'
import VoluntariosEquipes from './pages/Voluntarios/VoluntariosEquipes'
import Servos from './pages/Servos/Servos'
import Equipes from './pages/Servos/Equipes'
import Kids from './pages/Kids/Kids'
import Hub from './pages/Hub/Hub'
import Events from './pages/Events/Events'
import Contact from './pages/Contact/Contact'
import Sermons from './pages/Sermons/Sermons'
import Gallery from './pages/Gallery/Gallery'
import GalleryDetail from './pages/Gallery/GalleryDetail'
import Blog from './pages/Blog/Blog'
import BlogDetail from './pages/Blog/BlogDetail'
import Generosidade from './pages/Generosidade/Generosidade'
import Leadership from './pages/Leadership/Leadership'
import LeaderDetail from './pages/Leadership/LeaderDetail'
import CadastroMembro from './pages/CadastroMembro/CadastroMembro'
import NotFound from './pages/NotFound/NotFound'

function App() {
  return (
    <ErrorBoundary>
      <Layout>
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
        <Route path="/sermoes" element={<Sermons />} />
        <Route path="/galeria" element={<Gallery />} />
        <Route path="/galeria/:id" element={<GalleryDetail />} />
        <Route path="/noticias" element={<Blog />} />
        <Route path="/noticias/:id" element={<BlogDetail />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/generosidade" element={<Generosidade />} />
        <Route path="/lideranca" element={<Leadership />} />
        <Route path="/lideranca/:slug" element={<LeaderDetail />} />
        <Route path="/cadastro" element={<CadastroMembro />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  )
}

export default App



