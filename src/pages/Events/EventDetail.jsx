import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import apiService from '../../services/api.service'
import '../../styles/shared-pages.css'
import './Events.css'

function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [galerias, setGalerias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) loadEvent()
  }, [id])

  const loadEvent = async () => {
    try {
      setLoading(true)
      const [eventData, galeriasData] = await Promise.all([
        apiService.getEventById(id),
        apiService.getGaleriasByEvento(id).catch(() => [])
      ])
      setEvent(eventData)
      setGalerias(Array.isArray(galeriasData) ? galeriasData : [])
    } catch (error) {
      console.error('Erro ao carregar evento:', error)
      if (error.response?.status === 404) {
        navigate('/eventos')
      } else {
        setEvent(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch (error) {
      return dateString
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return ''
    try {
      if (timeString.includes(':')) {
        const parts = timeString.split(':')
        return `${parts[0]}:${parts[1]}`
      }
      return timeString
    } catch (error) {
      return timeString
    }
  }

  const getImageUrl = (imagem) => {
    if (!imagem) return '/images/conference.png'
    return apiService.getImageUrl(imagem) || '/images/conference.png'
  }

  const titulo = event?.titulo ?? event?.title ?? 'Evento'
  const descricao = event?.descricao ?? event?.description ?? ''
  const imagem = event?.imagemDestaque ?? event?.ImagemDestaque ?? event?.imagem ?? event?.image

  if (loading) {
    return (
      <div className="events-page">
        <section className="page-title-area">
          <div className="container">
            <h2 className="title">Carregando...</h2>
            <ul className="breadcrumb-nav">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/eventos">Eventos</Link></li>
              <li className="active">Detalhe</li>
            </ul>
          </div>
        </section>
        <section className="section-pad-top-bottom">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <p>Carregando evento...</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!event) {
    return null
  }

  return (
    <div className="events-page">
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">{titulo}</h2>
          <ul className="breadcrumb-nav">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/eventos">Eventos</Link></li>
            <li className="active">{titulo}</li>
          </ul>
        </div>
      </section>

      <section className="section-pad-top-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="testimonial-box-two mb-30">
                <div className="testimonial-inner">
                  <div className="testimonial-img">
                    <img
                      src={getImageUrl(imagem)}
                      alt={titulo}
                    />
                  </div>
                  <div className="content">
                    <h2>{titulo}</h2>
                    {descricao && <p className="mb-4">{descricao}</p>}
                    <ul className="categories">
                      {(event.dataInicio || event.data || event.date) && (
                        <li>
                          <span>
                            <i className="fa-solid fa-calendar-days"></i> Data:{' '}
                            {formatDate(event.dataInicio || event.data || event.date)}
                          </span>
                        </li>
                      )}
                      {(event.horaInicio || event.horarioInicio || event.startTime) && (
                        <li>
                          <span>
                            <i className="fa-solid fa-clock"></i> Início:{' '}
                            {formatTime(event.horaInicio || event.horarioInicio || event.startTime)}
                          </span>
                        </li>
                      )}
                      {(event.horaFim || event.horarioFim || event.endTime) && (
                        <li>
                          <span>
                            <i className="fa-solid fa-clock"></i> Término:{' '}
                            {formatTime(event.horaFim || event.horarioFim || event.endTime)}
                          </span>
                        </li>
                      )}
                    </ul>
                    <div className="author mt-4">
                      <div className="readmorebtn">
                        <Link to="/eventos">
                          <i className="fa-solid fa-arrow-left"></i> Voltar aos Eventos
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {galerias.length > 0 && (
            <div className="row mt-5">
              <div className="col-12">
                <h3 className="mb-4">Galerias de fotos deste evento</h3>
                <div className="row">
                  {galerias.map((galeria) => (
                    <div key={galeria.id} className="col-lg-4 col-md-6 mb-4">
                      <Link to={`/galeria/${galeria.id}`} className="text-decoration-none">
                        <div className="testimonial-box-two h-100">
                          <div className="testimonial-inner">
                            <div className="content">
                              <h5>{galeria.nome}</h5>
                              {galeria.quantidadeFotos != null && (
                                <p className="text-muted small mb-0">
                                  <i className="fa-solid fa-images"></i> {galeria.quantidadeFotos} fotos
                                </p>
                              )}
                              <span className="readmorebtn small">
                                Ver galeria <i className="fa-solid fa-arrow-right"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default EventDetail
