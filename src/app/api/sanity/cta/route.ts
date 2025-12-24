import {NextResponse} from 'next/server'

import {sanityClient} from '../../../../lib/sanity.client'
import {CTA_QUERY} from '../../../../lib/sanity.queries'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const ctas = await sanityClient.fetch(CTA_QUERY)

    return NextResponse.json({
      success: true,
      count: ctas.length,
      ctas,
    })
  } catch (error) {
    console.error('Sanity CTA API error:', error)
    return NextResponse.json(
      {success: false, error: 'Failed to fetch CTAs from Sanity'},
      {status: 500}
    )
  }
}
