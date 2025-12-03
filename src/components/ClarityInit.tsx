'use client'

import { useEffect } from 'react'
import Clarity from '@microsoft/clarity'

export default function ClarityInit() {
  useEffect(() => {
    try {
      Clarity.init('ufg3vya8z2')
    } catch {}
  }, [])
  return null
}
