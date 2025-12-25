import {groq} from 'groq'

export const MENU_ITEMS_QUERY = groq`
  *[_type == "menuItem"] | order(category asc, title asc) {
    _id,
    title,
    weight,
    price,
    description,
    category
  }
`

export const ACTIVE_PROMOS_QUERY = groq`
  *[_type == "promo"] | order(_createdAt desc) {
    _id,
    title,
    description,
    image,
    startDate,
    endDate,
    features[] {
      icon,
      title,
      text
    },
    buttonLink,
    buttonLabel
  }
`

export const CTA_QUERY = groq`
  *[_type == "callToAction"] | order(_createdAt desc) {
    _id,
    headline,
    subtext,
    linkUrl,
    backgroundImage
  }
`
