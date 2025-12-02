import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Ministries from './pages/Ministries/Ministries'
import Events from './pages/Events/Events'
import Contact from './pages/Contact/Contact'
import Sermons from './pages/Sermons/Sermons'
import Gallery from './pages/Gallery/Gallery'
import GalleryDetail from './pages/Gallery/GalleryDetail'
import Blog from './pages/Blog/Blog'
import Generosidade from './pages/Generosidade/Generosidade'
import NotFound from './pages/NotFound/NotFound'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/ministerios" element={<Ministries />} />
        <Route path="/eventos" element={<Events />} />
        <Route path="/sermoes" element={<Sermons />} />
        <Route path="/galeria" element={<Gallery />} />
        <Route path="/galeria/:id" element={<GalleryDetail />} />
        <Route path="/noticias" element={<Blog />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/generosidade" element={<Generosidade />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App



