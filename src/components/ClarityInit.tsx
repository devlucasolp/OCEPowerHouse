'use client'

import { useEffect } from 'react'
import Clarity from '@microsoft/clarity'

export default function ClarityInit() {
  useEffect(() => {
    try {
      const id = process.env.NEXT_PUBLIC_CLARITY_ID || 'ufg3vya8z2'
      Clarity.init(id)
      Clarity.consentV2()
      Clarity.setTag('env', process.env.NODE_ENV || 'production')
      Clarity.event('app_router_loaded')
    } catch {}
  }, [])
  return null
}
