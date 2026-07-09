import { useEffect, useState } from 'react'
import { wixClient } from '../wix'

export interface WixMember {
  id: string
  profile?: { name?: string; photo?: { url?: string } }
  loginEmail?: string
}

export function useMembers() {
  const [data, setData] = useState<WixMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    wixClient.members
      .queryMembers()
      .limit(20)
      .find()
      .then(res => setData(res.items as WixMember[]))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { members: data, loading }
}
