import { useState } from 'react'

export interface WixService {
  _id?: string
  name?: string
  description?: string
  media?: { mainMedia?: { image?: { url?: string } } }
  payment?: { fixed?: { price?: { value?: string; currency?: string } } }
  tagLine?: string
  category?: { name?: string }
}

export function useServices() {
  const [data] = useState<WixService[]>([])
  return { services: data, loading: false }
}
