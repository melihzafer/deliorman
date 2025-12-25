'use client'

import { useEffect } from 'react'
import { register } from 'swiper/element/bundle'

/**
 * ClientBoot
 * - Runs client-only bootstrapping that must not execute during SSR.
 * - Keeps root layout deterministic to avoid hydration mismatches.
 */
export default function ClientBoot() {
  useEffect(() => {
    // Register Swiper custom elements on the client only.
    register()
  }, [])

  return null
}

