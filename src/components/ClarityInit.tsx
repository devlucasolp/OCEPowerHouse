'use client'

import { useEffect } from 'react'

export default function ClarityInit() {
  useEffect(() => {
    try {
      const id = process.env.NEXT_PUBLIC_CLARITY_ID || 'ufg3vya8z2'
      ;(async () => {
        const { default: Clarity } = await import('@microsoft/clarity')
        Clarity.init(id)
        Clarity.consentV2()
        Clarity.setTag('env', process.env.NODE_ENV || 'production')
        Clarity.event('app_router_loaded')
      })()
    } catch {}
  }, [])
  return null
}
