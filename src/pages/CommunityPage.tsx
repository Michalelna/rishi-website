import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TriangleSymbol } from '../components/Symbols'
import EventsSection from '../components/EventsSection'
import { wixClient } from '../lib/wix'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ForumPost {
  id: string
  author: string
  role: string
  avatar: string
  time: string
  category: string
  categoryId: string
  title: string
  content: string
  likes: number
  comments: number
  liked: boolean
}

interface ForumCategory {
  id: string
  label: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000)
  if (secs < 60) return 'just now'
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  if (secs < 172800) return 'Yesterday'
  return `${Math.floor(secs / 86400)} days ago`
}

const categoryColors: Record<string, string> = {
  Yoga: '#c9a96e',
  Meditation: '#a78bfa',
  Breathwork: '#38bdf8',
  Nutrition: '#4ade80',
  Mindfulness: '#fb923c',
  Gratitude: '#f472b6',
}

function categoryColor(name: string): string {
  return categoryColors[name] ?? '#c9a96e'
}

// ─── Past gatherings (still uses Wix Events images via EventsSection) ─────────

const PAST_EVENTS = [
  { title: 'Winter Solstice Gathering', date: 'Dec 21, 2024', location: 'Topanga Canyon, CA', image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=85&fit=crop', attendees: 38 },
  { title: 'Silent Meditation Retreat', date: 'Nov 14–16, 2024', location: 'Big Sur, CA', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=85&fit=crop', attendees: 24 },
  { title: 'Dawn Flow & Sound Bath', date: 'Oct 5, 2024', location: 'Griffith Park, LA', image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=85&fit=crop', attendees: 56 },
  { title: 'Breathwork Immersion', date: 'Sep 22, 2024', location: 'Venice Beach Studio', image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=85&fit=crop', attendees: 18 },
  { title: 'Full Moon Ceremony', date: 'Aug 19, 2024', location: 'Malibu Bluffs', image: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800&q=85&fit=crop', attendees: 42 },
  { title: 'Yoga & Sacred Geometry', date: 'Jul 7, 2024', location: 'Downtown LA Loft', image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800&q=85&fit=crop', attendees: 31 },
]

function EventsGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  return (
    <section style={{ padding: '80px 80px 100px', borderTop: '1px solid rgba(201,169,110,0.14)', background: 'rgba(255,255,255,0.01)' }}>
      <div style={{ marginBottom: 52 }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.38em', color: 'rgba(201,169,110,0.82)', textTransform: 'uppercase', marginBottom: 14 }}>Memories</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, letterSpacing: '0.04em', color: 'rgba(245,240,232,0.88)' }}>Past Gatherings</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto auto', gap: 3 }}>
        {PAST_EVENTS.map((ev, i) => (
          <motion.div key={ev.title} whileHover={{ zIndex: 2 }} onClick={() => setLightbox(i)}
            style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', aspectRatio: i === 0 ? '16/9' : '4/3', gridColumn: i === 0 ? '1 / 3' : undefined }}>
            <motion.img src={ev.image} alt={ev.title} whileHover={{ scale: 1.05 }} transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.55) saturate(0.7)' }} />
            <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.25 }}
              style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,4,3,0.85) 0%, transparent 55%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px 24px' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, color: 'rgba(245,240,232,0.95)', marginBottom: 4 }}>{ev.title}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.2em', color: 'rgba(201,169,110,0.8)', textTransform: 'uppercase' }}>{ev.date}</span>
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.15em', color: 'rgba(245,240,232,0.82)', textTransform: 'uppercase' }}>{ev.attendees} joined</span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {lightbox !== null && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}
              style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(3,2,2,0.93)', backdropFilter: 'blur(12px)', cursor: 'zoom-out' }} />
            <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 401, maxWidth: 900, width: '90vw' }}>
              <img src={PAST_EVENTS[lightbox].image} alt={PAST_EVENTS[lightbox].title} style={{ width: '100%', maxHeight: '70vh', objectFit: 'cover', display: 'block', filter: 'brightness(0.85)' }} />
              <div style={{ padding: '24px 32px', background: 'rgba(10,9,8,0.97)', borderTop: '1px solid rgba(201,169,110,0.2)' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, color: 'rgba(245,240,232,0.92)', marginBottom: 6 }}>{PAST_EVENTS[lightbox].title}</p>
                <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.2em', color: 'rgba(201,169,110,0.75)', textTransform: 'uppercase' }}>{PAST_EVENTS[lightbox].date}</span>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.15em', color: 'rgba(245,240,232,0.76)', textTransform: 'uppercase' }}>{PAST_EVENTS[lightbox].location}</span>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.15em', color: 'rgba(245,240,232,0.68)', textTransform: 'uppercase' }}>{PAST_EVENTS[lightbox].attendees} joined</span>
                </div>
              </div>
              {lightbox > 0 && <button onClick={e => { e.stopPropagation(); setLightbox(lightbox - 1) }} style={{ position: 'absolute', left: -56, top: '40%', background: 'none', border: '1px solid rgba(245,240,232,0.15)', cursor: 'pointer', color: 'rgba(245,240,232,0.82)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>}
              {lightbox < PAST_EVENTS.length - 1 && <button onClick={e => { e.stopPropagation(); setLightbox(lightbox + 1) }} style={{ position: 'absolute', right: -56, top: '40%', background: 'none', border: '1px solid rgba(245,240,232,0.15)', cursor: 'pointer', color: 'rgba(245,240,232,0.82)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>›</button>}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const [categories, setCategories] = useState<ForumCategory[]>([{ id: 'all', label: 'All' }])
  const [activeCategory, setActiveCategory] = useState('all')
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [composing, setComposing] = useState(false)
  const [draftText, setDraftText] = useState('')
  const [draftTitle, setDraftTitle] = useState('')
  const [draftCategoryId, setDraftCategoryId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ── Fetch categories ───────────────────────────────────────────────────────
  useEffect(() => {
    async function loadCategories() {
      try {
        const { categories: cats } = await wixClient.forumCategories.queryCategories().find()
        const mapped: ForumCategory[] = (cats ?? []).map(c => ({ id: c._id ?? '', label: c.name ?? 'General' }))
        setCategories([{ id: 'all', label: 'All' }, ...mapped])
        if (mapped.length > 0) setDraftCategoryId(mapped[0].id)
      } catch (err) {
        console.warn('[Rishi] Forum categories fetch failed:', err)
      }
    }
    loadCategories()
  }, [])

  // ── Fetch posts ────────────────────────────────────────────────────────────
  const loadPosts = useCallback(async (categoryId?: string) => {
    setLoading(true)
    try {
      let query = wixClient.forumPosts.queryPosts().descending('_createdDate').limit(20)
      if (categoryId && categoryId !== 'all') {
        query = query.eq('categoryId', categoryId)
      }
      const { posts: rawPosts } = await query.find()

      const mapped: ForumPost[] = (rawPosts ?? []).map(p => {
        const owner = p.owner
        const created = p._createdDate ? new Date(p._createdDate) : new Date()
        const catLabel = categories.find(c => c.id === p.categoryId)?.label ?? 'General'

        // Extract plain text from excerpt or fall back to title
        const body = (p as any).excerpt ?? p.title ?? ''

        return {
          id: p._id ?? String(Math.random()),
          author: owner?.nickname ?? owner?.name ?? 'Member',
          role: 'Community Member',
          avatar: (owner as any)?.image?.url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(owner?.nickname ?? 'M')}&background=1c1820&color=c9a96e&size=80`,
          time: timeAgo(created),
          category: catLabel,
          categoryId: p.categoryId ?? '',
          title: p.title ?? '',
          content: body,
          likes: p.likeCount ?? 0,
          comments: p.totalComments ?? 0,
          liked: false,
        }
      })
      setPosts(mapped)
    } catch (err) {
      console.warn('[Rishi] Forum posts fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }, [categories])

  useEffect(() => {
    loadPosts(activeCategory)
  }, [activeCategory, loadPosts])

  // ── Escape key ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!composing) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setComposing(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [composing])

  // ── Like / unlike ──────────────────────────────────────────────────────────
  async function toggleLike(post: ForumPost) {
    // Optimistic update
    setPosts(prev => prev.map(p => p.id === post.id
      ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
      : p
    ))
    try {
      if (post.liked) {
        await wixClient.forumPosts.unlikePost(post.id)
      } else {
        await wixClient.forumPosts.likePost(post.id)
      }
    } catch {
      // Revert on failure
      setPosts(prev => prev.map(p => p.id === post.id
        ? { ...p, liked: post.liked, likes: post.likes }
        : p
      ))
    }
  }

  // ── Create post ────────────────────────────────────────────────────────────
  async function submitPost() {
    if (!draftTitle.trim() && !draftText.trim()) return
    setSubmitting(true)
    try {
      await wixClient.forumPosts.createPost({
        categoryId: draftCategoryId,
        title: draftTitle.trim() || draftText.trim().slice(0, 60),
        content: {
          blocks: [{
            key: 'rishi1',
            text: draftText.trim(),
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          }],
          entityMap: {},
        },
      })
      setDraftText('')
      setDraftTitle('')
      setComposing(false)
      await loadPosts(activeCategory)
    } catch (err) {
      console.warn('[Rishi] Create post failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const visible = posts

  return (
    <div style={{ minHeight: '100vh', background: '#1c1820' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: '60vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div layoutId="panel-bg-community" transition={{ type: 'spring', stiffness: 70, damping: 18, mass: 1 }}
          style={{ position: 'absolute', inset: 0, backgroundImage: `url(https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&q=85&fit=crop)`, backgroundSize: 'cover', backgroundPosition: '50% 35%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(15,35,20,0.72) 60%, #1c1820 100%)' }} />
        <motion.h1 layoutId="panel-label-community" transition={{ type: 'spring', stiffness: 70, damping: 18, mass: 1 }} animate={{ opacity: 1 }}
          style={{ position: 'absolute', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(80px, 15vw, 200px)', fontWeight: 300, letterSpacing: '0.15em', color: 'rgba(245,240,232,0.1)', userSelect: 'none', pointerEvents: 'none', lineHeight: 1, whiteSpace: 'nowrap' }}>
          COMMUNITY
        </motion.h1>
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 1.6, ease: 'easeOut' }}
          style={{ position: 'absolute', top: -80, right: -80, zIndex: 2, pointerEvents: 'none' }}>
          <TriangleSymbol size={580} color="rgba(245,240,232,0.08)" isHovered={false} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
          style={{ position: 'absolute', bottom: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 2 }}>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, fontWeight: 300, letterSpacing: '0.35em', color: 'rgba(201,169,110,0.7)', textTransform: 'uppercase' }}>Connect · Share · Grow</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, letterSpacing: '0.1em', color: 'var(--white)' }}>The Gathering</h2>
        </motion.div>
      </div>

      <EventsSection />

      {/* Share button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '24px 80px', borderBottom: '1px solid rgba(201,169,110,0.14)' }}>
        <motion.button whileHover={{ scale: 1.02, borderColor: 'rgba(201,169,110,0.6)' }} whileTap={{ scale: 0.97 }} onClick={() => setComposing(true)}
          style={{ background: 'none', border: '1px solid rgba(201,169,110,0.5)', cursor: 'pointer', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,0.8)" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.28em', color: 'rgba(201,169,110,0.8)', textTransform: 'uppercase' }}>Share a thought</span>
        </motion.button>
      </div>

      {/* Category filter */}
      <div style={{ padding: '0 80px', borderBottom: '1px solid rgba(201,169,110,0.14)', display: 'flex', overflowX: 'auto' }}>
        {categories.map(cat => {
          const active = cat.id === activeCategory
          const col = categoryColor(cat.label)
          return (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              style={{ background: 'none', border: 'none', borderBottom: active ? `2px solid ${col}` : '2px solid transparent', cursor: 'pointer', padding: '20px 22px', fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: active ? 400 : 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: active ? col : 'rgba(245,240,232,0.68)', whiteSpace: 'nowrap', flexShrink: 0, transition: 'color 0.2s' }}>
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Post feed */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 40px 60px' }}>
        {loading && (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, fontStyle: 'italic', color: 'rgba(245,240,232,0.3)' }}>Loading…</p>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {visible.map((post, i) => {
            const catColor = categoryColor(post.category)
            return (
              <motion.article key={post.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.32, delay: i * 0.04 }}
                style={{ padding: '36px 0', borderBottom: '1px solid rgba(245,240,232,0.05)' }}>
                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(201,169,110,0.4)', flexShrink: 0 }}>
                    <img src={post.avatar} alt={post.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 400, color: 'rgba(245,240,232,0.9)', marginBottom: 2 }}>{post.author}</p>
                    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.2em', color: 'rgba(201,169,110,0.7)', textTransform: 'uppercase' }}>{post.role}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {post.category !== 'General' && (
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, fontWeight: 300, letterSpacing: '0.2em', textTransform: 'uppercase', color: catColor, border: `1px solid ${catColor}44`, padding: '3px 10px' }}>{post.category}</span>
                    )}
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.1em', color: 'rgba(245,240,232,0.68)' }}>{post.time}</span>
                  </div>
                </div>

                {/* Title + content */}
                {post.title && (
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, letterSpacing: '0.02em', color: 'rgba(245,240,232,0.92)', marginBottom: 10 }}>{post.title}</p>
                )}
                {post.content && (
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 300, fontStyle: 'italic', lineHeight: 1.75, color: 'rgba(245,240,232,0.72)', letterSpacing: '0.02em', marginBottom: 26 }}>{post.content}</p>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                  <motion.button whileTap={{ scale: 0.82 }} onClick={() => toggleLike(post)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: 0 }}>
                    <motion.svg width="15" height="15" viewBox="0 0 24 24" animate={{ fill: post.liked ? 'rgba(201,169,110,0.85)' : 'none' }} transition={{ duration: 0.2 }}
                      stroke={post.liked ? 'rgba(201,169,110,0.85)' : 'rgba(245,240,232,0.52)'} strokeWidth="1.5">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </motion.svg>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.1em', color: post.liked ? 'rgba(201,169,110,0.85)' : 'rgba(245,240,232,0.52)', transition: 'color 0.2s' }}>{post.likes}</span>
                  </motion.button>

                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(245,240,232,0.52)" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.1em', color: 'rgba(245,240,232,0.52)' }}>{post.comments}</span>
                  </button>

                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: 0, marginLeft: 'auto' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(245,240,232,0.2)" strokeWidth="1.5" strokeLinecap="round">
                      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  </button>
                </div>
              </motion.article>
            )
          })}
        </AnimatePresence>

        {!loading && visible.length === 0 && (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, fontStyle: 'italic', color: 'rgba(245,240,232,0.72)' }}>
              No posts yet in this category.
            </p>
          </div>
        )}
      </div>

      <EventsGallery />

      {/* Compose modal */}
      <AnimatePresence>
        {composing && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setComposing(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(5,5,4,0.82)', backdropFilter: 'blur(10px)' }} />
            <motion.div role="dialog" aria-modal="true" aria-label="Share a thought"
              initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 301, width: 560, background: 'rgba(10,9,8,0.99)', border: '1px solid rgba(201,169,110,0.15)', boxShadow: '0 40px 100px rgba(0,0,0,0.85)', padding: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: 'rgba(245,240,232,0.9)' }}>Share a thought</h2>
                <button onClick={() => setComposing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,240,232,0.52)', fontSize: 22, lineHeight: 1, padding: 4 }}>×</button>
              </div>

              {/* Category selector (real categories) */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {categories.filter(c => c.id !== 'all').map(cat => {
                  const sel = cat.id === draftCategoryId
                  const col = categoryColor(cat.label)
                  return (
                    <button key={cat.id} onClick={() => setDraftCategoryId(cat.id)}
                      style={{ background: sel ? `${col}18` : 'none', border: `1px solid ${sel ? col : 'rgba(245,240,232,0.1)'}`, cursor: 'pointer', padding: '5px 14px', fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.2em', textTransform: 'uppercase', color: sel ? col : 'rgba(245,240,232,0.58)', transition: 'all 0.18s' }}>
                      {cat.label}
                    </button>
                  )
                })}
              </div>

              <input
                value={draftTitle}
                onChange={e => setDraftTitle(e.target.value)}
                placeholder="Title (optional)"
                style={{ width: '100%', background: 'rgba(245,240,232,0.03)', border: '1px solid rgba(245,240,232,0.08)', borderBottom: 'none', padding: '14px 20px', fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 400, color: 'rgba(245,240,232,0.9)', outline: 'none', boxSizing: 'border-box' }}
              />
              <textarea autoFocus value={draftText} onChange={e => setDraftText(e.target.value)} placeholder="What are you noticing today?" rows={5}
                style={{ width: '100%', background: 'rgba(245,240,232,0.03)', border: '1px solid rgba(245,240,232,0.08)', padding: '20px', fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, fontStyle: 'italic', lineHeight: 1.7, color: 'rgba(245,240,232,0.95)', resize: 'none', outline: 'none', boxSizing: 'border-box' }} />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 14, marginTop: 20 }}>
                <button onClick={() => setComposing(false)}
                  style={{ background: 'none', border: '1px solid rgba(245,240,232,0.1)', cursor: 'pointer', padding: '10px 24px', fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.58)' }}>
                  Cancel
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={submitPost} disabled={submitting || (!draftText.trim() && !draftTitle.trim())}
                  style={{ background: draftText.trim() ? 'rgba(201,169,110,0.2)' : 'transparent', border: `1px solid ${draftText.trim() ? 'rgba(201,169,110,0.5)' : 'rgba(245,240,232,0.07)'}`, cursor: draftText.trim() ? 'pointer' : 'default', padding: '10px 32px', fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.26em', textTransform: 'uppercase', color: draftText.trim() ? 'rgba(201,169,110,0.9)' : 'rgba(245,240,232,0.18)', transition: 'all 0.2s' }}>
                  {submitting ? 'Posting…' : 'Post'}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom gradient fade */}
      <div style={{ height: 160, background: 'linear-gradient(to bottom, transparent 0%, #1c1820 100%)', marginTop: -120, position: 'relative', zIndex: 1, pointerEvents: 'none' }} />
    </div>
  )
}
