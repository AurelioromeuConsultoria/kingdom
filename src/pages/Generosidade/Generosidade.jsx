import { Link } from 'react-router-dom'
import { useState } from 'react'
import './Generosidade.css'

function Generosidade() {
  const [qrCodeError, setQrCodeError] = useState(false)
  
  return (
    <div className="generosidade-page">
      {/* Page Title Start */}
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">Generosidade</h2>
          <ul className="breadcrumb-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li className="active">Generosidade</li>
          </ul>
        </div>
      </section>
      {/* Page Title End */}

      {/* Generosidade Content Start */}
      <section className="section-pad-top-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="section-title text-center mb-40">
                <h2 className="title">Contribuir é nosso privilégio</h2>
              </div>
              
              {/* Texto */}
              <div className="mb-40" style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#616161', marginBottom: '20px' }}>
                  Temos como cultura que o ato de doar é uma maneira de expressar a nossa gratidão a Deus por tudo o que Ele nos deu.
                </p>
                <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#616161', marginBottom: '20px' }}>
                  A Bíblia diz em João 3:15-16 que Jesus amou e se entregou para que o próximo não perecesse. O valor da generosidade está na compreensão do privilégio de sacrificar em benefício do outro.
                </p>
                <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#616161' }}>
                  Também entendemos que a nossa comunidade crescerá com um pedacinho do coração de cada um, isso inclui todos os nossos recursos: tempo, dinheiro e talentos. Devemos ser generosos com todos eles!
                </p>
              </div>

              {/* Imagem */}
              <div className="text-center mb-40">
                <img 
                  src="/images/generosidade.jpg" 
                  alt="Generosidade" 
                  className="img-fluid"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                />
              </div>

              {/* QR Code */}
              <div className="text-center">
                <p style={{ fontSize: '18px', color: '#616161', marginBottom: '30px', fontWeight: '600' }}>
                  Escaneie o QR Code para contribuir:
                </p>
                <div style={{ display: 'inline-block', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                  {!qrCodeError ? (
                    <img 
                      src="/images/PIX.png" 
                      alt="QR Code PIX para Generosidade" 
                      className="img-fluid"
                      style={{ width: '250px', height: '250px', display: 'block', objectFit: 'contain', maxWidth: '100%' }}
                      onError={() => setQrCodeError(true)}
                    />
                  ) : (
                    <div 
                      style={{ 
                        width: '250px', 
                        height: '250px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        border: '2px dashed #ccc',
                        borderRadius: '8px',
                        color: '#999',
                        textAlign: 'center',
                        padding: '20px',
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}
                    >
                      <i className="fa-solid fa-image" style={{ fontSize: '48px', marginBottom: '10px', opacity: 0.5 }}></i>
                      <div>QR Code não encontrado</div>
                      <div style={{ fontSize: '12px', marginTop: '5px' }}>
                        Adicione a imagem em:<br/>
                        <code style={{ fontSize: '11px' }}>site/public/images/PIX.png</code>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Generosidade Content End */}
    </div>
  )
}

export default Generosidade

