import { Helmet } from 'react-helmet-async'
import { SITE_BASE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '../../config/seo'

/**
 * Componente de SEO: título, meta description, canonical, Open Graph e Twitter Card.
 * Use em cada página para melhor indexação e compartilhamento.
 *
 * @param {string} title - Título da página (aparece na aba e nos resultados de busca)
 * @param {string} [description] - Meta description (até ~160 caracteres)
 * @param {string} [path] - Caminho da página (ex: '/sobre'). Se vazio, usa '/'
 * @param {string} [image] - URL absoluta da imagem para OG/Twitter (opcional)
 * @param {boolean} [noIndex] - Se true, pede para não indexar (ex: páginas internas)
 */
function SEO({ title, description, path = '/', image = DEFAULT_OG_IMAGE, noIndex = false }) {
  const canonicalUrl = path.startsWith('http') ? path : `${SITE_BASE_URL}${path === '' ? '/' : path}`
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const ogImage = image.startsWith('http') ? image : `${SITE_BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="pt_BR" />
      {description && <meta property="og:description" content={description} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  )
}

export default SEO
