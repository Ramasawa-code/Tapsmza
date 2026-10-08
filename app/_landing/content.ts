export const SITE_URL = 'https://tapsmza.site'

// TODO: reemplazar por el número real (formato internacional, sin "+" ni espacios).
const WHATSAPP_FALLBACK = '5492613343370'
const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || WHATSAPP_FALLBACK).replace(/\D/g, '')

export function whatsappUrl(message = 'Hola! Quiero consultar por las tarjetas NFC/QR de TAPS MZA.') {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const NAV_LINKS = [
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#beneficios', label: 'Beneficios' },
  { href: '#demo', label: 'Demo' },
  { href: '#faq', label: 'Preguntas' },
] as const

export const TRUST = [
  { icon: 'phone', title: 'Sin apps', text: 'Funciona con la cámara y el NFC del celular' },
  { icon: 'nfc', title: 'iPhone y Android', text: 'Compatible con los celulares actuales' },
  { icon: 'link', title: 'Link editable', text: 'Cambiá el destino sin reimprimir' },
  { icon: 'pin', title: 'Hecho en Mendoza', text: 'Atención directa y local' },
] as const

export const BEFORE_STEPS = [
  'Le pedís al cliente que te busque en Google',
  'Escribe mal el nombre o elige otro local',
  'Busca dónde dejar la reseña',
  'Se distrae y se olvida',
] as const

export const AFTER_STEPS = [
  'Apoya el celular en la tarjeta (o escanea el QR)',
  'Cae directo en tu reseña, listo para puntuar',
] as const

export const STEPS = [
  {
    n: '01',
    title: 'Elegís tu tarjeta',
    text: 'Una tarjeta NFC con QR de respaldo, con el diseño y la marca de tu negocio.',
  },
  {
    n: '02',
    title: 'Configuramos tu link',
    text: 'La vinculamos a tu ficha de Google Maps, tus redes, tu web o cualquier enlace que quieras.',
  },
  {
    n: '03',
    title: 'Tus clientes tocan y listo',
    text: 'Acercan el celular o escanean el QR y llegan directo, sin buscar ni instalar nada.',
  },
] as const

export const USE_CASES = [
  { icon: 'utensils', title: 'Gastronomía', text: 'En la mesa o junto a la caja: reseñas y carta digital en un toque.' },
  { icon: 'scissors', title: 'Estética y barberías', text: 'Que cada turno termine con una reseña y una cuenta de Instagram nueva.' },
  { icon: 'bed', title: 'Hoteles y turismo', text: 'En recepción y habitaciones: reseñas, mapa y contacto al instante.' },
  { icon: 'heart', title: 'Salud y bienestar', text: 'Consultorios, gimnasios y centros: confianza visible desde el primer contacto.' },
  { icon: 'store', title: 'Comercios', text: 'En el mostrador: reseñas, catálogo, WhatsApp o tu tienda online.' },
  { icon: 'wrench', title: 'Servicios y oficios', text: 'Entregá tu tarjeta y que tus trabajos hablen por vos.' },
] as const

export const NFC_POINTS = [
  'Un toque: sin abrir la cámara',
  'La experiencia más rápida y fluida',
  'Ideal para mostradores y mesas',
] as const

export const QR_POINTS = [
  'Funciona en cualquier celular con cámara',
  'Respaldo impreso en la misma tarjeta',
  'Perfecto para vidrieras, flyers y cartelería',
] as const

export const DEMOS = [
  {
    id: 'resenas',
    icon: 'star',
    label: 'Reseñas de Google',
    host: 'google.com/maps',
    title: 'Dejá tu reseña',
    sub: 'Tu opinión ayuda a otros a elegirnos',
    cta: 'Publicar reseña',
  },
  {
    id: 'instagram',
    icon: 'instagram',
    label: 'Instagram',
    host: 'instagram.com',
    title: 'Seguinos',
    sub: 'Enterate de novedades y promos',
    cta: 'Seguir',
  },
  {
    id: 'web',
    icon: 'globe',
    label: 'Sitio web',
    host: 'tunegocio.com',
    title: 'Conocé más',
    sub: 'Servicios, horarios y ubicación',
    cta: 'Ver sitio',
  },
  {
    id: 'whatsapp',
    icon: 'chat',
    label: 'WhatsApp',
    host: 'wa.me',
    title: 'Escribinos',
    sub: 'Consultas y reservas al instante',
    cta: 'Abrir chat',
  },
  {
    id: 'menu',
    icon: 'menu',
    label: 'Carta o catálogo',
    host: 'tunegocio.com/carta',
    title: 'Nuestra carta',
    sub: 'Siempre actualizada, sin imprimir',
    cta: 'Ver carta',
  },
] as const

export const FAQS = [
  {
    q: '¿Mis clientes tienen que instalar una app?',
    a: 'No. La tarjeta funciona con el NFC del celular y, si prefieren, con la cámara escaneando el QR. En ambos casos se abre el link directo.',
  },
  {
    q: '¿Funciona con iPhone y con Android?',
    a: 'Sí. Los iPhone y los Android actuales leen NFC sin configurar nada. Y como cada tarjeta incluye un QR de respaldo, cualquier celular con cámara puede usarla.',
  },
  {
    q: '¿Necesita batería o carga?',
    a: 'No. El chip NFC se activa con el propio celular, no tiene batería y no hay nada que cargar ni mantener.',
  },
  {
    q: '¿Puedo cambiar el link más adelante?',
    a: 'Sí. Podés cambiar el destino cuando quieras (por ejemplo, de reseñas a una promo) y la misma tarjeta sigue funcionando. No hace falta reimprimir.',
  },
  {
    q: '¿Se puede personalizar con mi marca?',
    a: 'Sí. Escribinos por WhatsApp y te contamos las opciones de diseño disponibles para tu negocio.',
  },
  {
    q: '¿Cuánto cuesta y cuánto tarda?',
    a: 'Depende de la cantidad y del diseño. Consultanos por WhatsApp y te pasamos precio y plazos para tu caso.',
  },
] as const
