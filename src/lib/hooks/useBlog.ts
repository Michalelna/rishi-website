import { useEffect, useState } from 'react'
import { wixClient } from '../wix'

export interface WixPost {
  _id?: string
  title?: string
  excerpt?: string
  coverImage?: string
  slug?: string
  firstPublishedDate?: string
  author?: { nickname?: string }
  minutesToRead?: number
}

export function useBlogPosts() {
  const [data, setData] = useState<WixPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    wixClient.blog
      .queryPosts()
      .limit(12)
      .find()
      .then(res => setData(res.items as WixPost[]))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { posts: data, loading }
}
