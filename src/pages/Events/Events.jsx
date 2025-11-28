import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../../services/api.service'

function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const data = await apiService.getEvents()
      setEvents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
      setEvents([])
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
      // Se for apenas hora (HH:mm ou HH:mm:ss), retornar formatado
      if (timeString.includes(':')) {
        const parts = timeString.split(':')
        return `${parts[0]}:${parts[1]}`
      }
      return timeString
    } catch (error) {
      return timeString
    }
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="events-page">
      {/* Page Title Start */}
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">Próximos Eventos</h2>
          <ul className="breadcrumb-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li className="active">Próximos Eventos</li>
          </ul>
        </div>
      </section>
      {/* Page Title End */}

      {/* Events Section Start */}
      <section className="section-pad-top-bottom">
        <div className="container">
          <div className="row">
            {loading ? (
              <div className="col-12 text-center">
                <p>Carregando eventos...</p>
              </div>
            ) : events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="col-lg-6">
                  <div className="testimonial-box-two mb-30">
                    <div className="testimonial-inner">
                      <div className="testimonial-img">
                        <img
                          src={event.imagem || event.image || '/images/conference.png'}
                          alt={event.titulo || event.title || 'Evento'}
                        />
                      </div>
                      <div className="content">
                        <h2>{event.titulo || event.title || 'Evento'}</h2>
                        <p>
                          {event.descricao || event.description || 'Venha participar deste evento especial...'}
                        </p>
                        <ul className="categories">
                          {event.dataInicio || event.data || event.date ? (
                            <li>
                              <a href="#">
                                <i className="fa-solid fa-calendar-days"></i> Data de Início:{' '}
                                {formatDate(event.dataInicio || event.data || event.date)}
                              </a>
                            </li>
                          ) : null}
                          {event.horaInicio || event.horarioInicio || event.startTime ? (
                            <li>
                              <a href="#">
                                <i className="fa-solid fa-clock"></i> Horário de Início:{' '}
                                {formatTime(event.horaInicio || event.horarioInicio || event.startTime)}
                              </a>
                            </li>
                          ) : null}
                          {event.horaFim || event.horarioFim || event.endTime ? (
                            <li>
                              <a href="#">
                                <i className="fa-solid fa-clock"></i> Horário de Término:{' '}
                                {formatTime(event.horaFim || event.horarioFim || event.endTime)}
                              </a>
                            </li>
                          ) : null}
                        </ul>
                        <div className="author">
                          <div className="readmorebtn">
                            <Link to={`/eventos/${event.id}`}>
                              Saiba Mais <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>Nenhum evento encontrado no momento.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Events Section End */}
    </div>
  )
}

export default Events
