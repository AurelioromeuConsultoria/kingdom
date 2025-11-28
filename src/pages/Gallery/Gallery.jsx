import { useEffect, useState } from 'react'
import apiService from '../../services/api.service'

function Gallery() {
  const [photos, setPhotos] = useState([])
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    try {
      const [photosData, videosData] = await Promise.all([
        apiService.getPhotos(),
        apiService.getVideos()
      ])
      setPhotos(Array.isArray(photosData) ? photosData : [])
      setVideos(Array.isArray(videosData) ? videosData : [])
    } catch (error) {
      console.error('Erro ao carregar galeria:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="gallery-page">
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">Galeria</h2>
          <ul className="breadcrumb-nav">
            <li>
              <a href="/">Home</a>
            </li>
            <li className="active">Galeria</li>
          </ul>
        </div>
      </section>

      <section className="section-gap">
        <div className="main-container">
          <div className="section-title text-center mb-40">
            <h2 className="title">Fotos</h2>
          </div>
          <div className="row">
            {loading ? (
              <div className="col-12 text-center">
                <p>Carregando galeria...</p>
              </div>
            ) : photos.length > 0 ? (
              photos.map((photo) => (
                <div key={photo.id} className="col-lg-4 col-md-6 mb-30">
                  <div className="photogallery">
                    <img src={photo.url || photo.image} alt={photo.title || 'Foto'} />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>Nenhuma foto encontrada.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Gallery

