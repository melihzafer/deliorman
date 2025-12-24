import {NextResponse} from 'next/server'

import {sanityClient} from '../../../../lib/sanity.client'
import {ACTIVE_PROMOS_QUERY} from '../../../../lib/sanity.queries'

export const runtime = 'nodejs'

export async function GET() {
  try {
    console.log('[Promos API] Client config:', {
      projectId: sanityClient.config().projectId,
      dataset: sanityClient.config().dataset,
      useCdn: sanityClient.config().useCdn,
    })

    const promos = await sanityClient.fetch(ACTIVE_PROMOS_QUERY)
    console.log('[Promos API] Fetched count:', promos?.length)

    return NextResponse.json({
      success: true,
      count: promos.length,
      promos,
    })
  } catch (error) {
    console.error('Sanity promos API error:', error)
    return NextResponse.json(
      {success: false, error: 'Failed to fetch promos from Sanity'},
      {status: 500}
    )
  }
}
