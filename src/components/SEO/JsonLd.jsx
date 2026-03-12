import { Helmet } from 'react-helmet-async'
import { SITE_BASE_URL, ORGANIZATION_JSONLD } from '../../config/seo'

/**
 * Injeta JSON-LD de Organization (igreja) no head da página inicial.
 * Uso: <JsonLdOrganization /> na Home.
 */
export function JsonLdOrganization({ churchInfo }) {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: churchInfo?.name ?? ORGANIZATION_JSONLD.name,
    description: churchInfo?.description ?? ORGANIZATION_JSONLD.description,
    url: SITE_BASE_URL,
    logo: churchInfo?.logo ?? ORGANIZATION_JSONLD.logo,
    image: churchInfo?.image ?? ORGANIZATION_JSONLD.image,
    telephone: churchInfo?.contact?.phone ?? ORGANIZATION_JSONLD.telephone,
    email: churchInfo?.contact?.email ?? ORGANIZATION_JSONLD.email,
    sameAs: churchInfo?.socialMedia?.length
      ? Object.values(churchInfo.socialMedia).filter(Boolean)
      : ORGANIZATION_JSONLD.sameAs
  }
  const addr = churchInfo?.address ?? ORGANIZATION_JSONLD.address
  if (addr) {
    org.address = {
      '@type': 'PostalAddress',
      streetAddress: addr.streetAddress ?? churchInfo?.address?.street ?? '',
      addressLocality: addr.addressLocality ?? churchInfo?.address?.city ?? 'Guarulhos',
      addressRegion: addr.addressRegion ?? churchInfo?.address?.region ?? 'SP',
      postalCode: addr.postalCode ?? churchInfo?.address?.postalCode ?? '',
      addressCountry: addr.addressCountry ?? churchInfo?.address?.country ?? 'BR'
    }
  }
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(org)}
      </script>
    </Helmet>
  )
}

/**
 * Injeta JSON-LD de Event para uma página de evento.
 * Uso: <JsonLdEvent event={event} imageUrl={getImageUrl(event.imagem)} /> (imageUrl = URL absoluta da imagem do evento)
 */
export function JsonLdEvent({ event, imageUrl: imageUrlProp, baseUrl = SITE_BASE_URL }) {
  if (!event) return null
  const name = event.titulo ?? event.title ?? 'Evento'
  const start = event.dataInicio ?? event.data ?? event.date
  const end = event.dataFim ?? event.dataFim
  const desc = event.descricao ?? event.description ?? ''
  const imageUrl = imageUrlProp || null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description: desc.slice(0, 500),
    url: `${baseUrl}/eventos/${event.id}`,
    startDate: start ? new Date(start).toISOString() : undefined,
    endDate: end ? new Date(end).toISOString() : undefined,
    ...(imageUrl && { image: imageUrl }),
    location: {
      '@type': 'Place',
      name: ORGANIZATION_JSONLD.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: ORGANIZATION_JSONLD.address.addressLocality,
        addressRegion: ORGANIZATION_JSONLD.address.addressRegion,
        addressCountry: ORGANIZATION_JSONLD.address.addressCountry
      }
    }
  }
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}
