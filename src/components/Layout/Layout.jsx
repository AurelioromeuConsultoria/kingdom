import { useEffect, useState } from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import BackToTop from '../BackToTop/BackToTop'
import apiService from '../../services/api.service'

function Layout({ children }) {
  const [churchInfo, setChurchInfo] = useState(null)
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    // Desabilitar menu de contexto (como no template original)
    document.addEventListener('contextmenu', (event) => {
      event.preventDefault()
    })
  }, [])

  return (
    <div className="app-wrapper">
      <Header churchInfo={churchInfo} loading={loading} />
      <main className="main-content">
        {children}
      </main>
      <Footer churchInfo={churchInfo} loading={loading} />
      <BackToTop />
    </div>
  )
}

export default Layout

