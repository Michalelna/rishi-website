import { useEffect, useState } from 'react'
import { wixClient } from '../wix'

export interface WixEvent {
  _id?: string
  title?: string
  dateAndTimeSettings?: { startDate?: string; endDate?: string }
  location?: { name?: string }
  mainImage?: { url?: string }
  guestListChecked?: number
}

export function useEvents() {
  const [data, setData] = useState<WixEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    wixClient.events
      .queryEvents()
      .limit(12)
      .find()
      .then(res => setData(res.items as WixEvent[]))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { events: data, loading }
}
