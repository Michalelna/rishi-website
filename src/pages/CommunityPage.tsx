import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TriangleSymbol } from '../components/Symbols'
import EventsSection from '../components/EventsSection'

const CATEGORIES = ['All', 'Mindfulness', 'Yoga', 'Breathwork', 'Meditation', 'Nutrition', 'Gratitude']

const INITIAL_POSTS = [
  {
    id: 1,
    author: 'Aria Moon',
    role: 'Yoga Teacher · Level 3',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
    time: '2h ago',
    category: 'Yoga',
    content: 'Morning flow complete. There is something sacred about moving your body before the world wakes. The mat becomes a threshold — what you bring to it and what you leave behind.',
    likes: 34,
    comments: 7,
  },
  {
    id: 2,
    author: 'Sage Rivera',
    role: 'Meditation Guide',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    time: '4h ago',
    category: 'Meditation',
    content: 'After 40 days of consecutive morning sits, I noticed the silence stopped being empty and started being full. Anyone else experienced this shift? How long did it take you?',
    likes: 61,
    comments: 18,
  },
  {
    id: 3,
    author: 'Luna Chandra',
    role: 'Breathwork Practitioner',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    time: '6h ago',
    category: 'Breathwork',
    content: 'Tried box breathing during a stressful meeting today — 4 counts in, hold, out, hold. Nobody noticed but me. Small rebellions of calm.',
    likes: 89,
    comments: 12,
  },
  {
    id: 4,
    author: 'Kai Forest',
    role: 'Holistic Nutritionist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    time: 'Yesterday',
    category: 'Nutrition',
    content: "Adaptogenic mushroom broth for lunch. Lion's mane for clarity, reishi for calm. What you eat is not separate from your practice — it is the practice.",
    likes: 47,
    comments: 9,
  },
  {
    id: 5,
    author: 'Zara Light',
    role: 'Mindfulness Coach',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
    time: 'Yesterday',
    category: 'Mindfulness',
    content: "Gratitude practice shift: instead of listing what I'm grateful for, I sit with one thing deeply. Today it was the sound of rain on the window. Three minutes. Completely present.",
    likes: 122,
    comments: 24,
  },
  {
    id: 6,
    author: 'River Stone',
    role: 'Community Member',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face',
    time: '2 days ago',
    category: 'Gratitude',
    content: 'First time sharing here. Been practicing for six months and finally feel like I have something to offer the conversation. Thank you for this space.',
    likes: 203,
    comments: 41,
  },
]

const EVENTS = [
  {
    title: 'Winter Solstice Gathering',
    date: 'Dec 21, 2024',
    location: 'Topanga Canyon, CA',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=85&fit=crop',
    attendees: 38,
  },
  {
    title: 'Silent Meditation Retreat',
    date: 'Nov 14–16, 2024',
    location: 'Big Sur, CA',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=85&fit=crop',
    attendees: 24,
  },
  {
    title: 'Dawn Flow & Sound Bath',
    date: 'Oct 5, 2024',
    location: 'Griffith Park, LA',
    image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=85&fit=crop',
    attendees: 56,
  },
  {
    title: 'Breathwork Immersion',
    date: 'Sep 22, 2024',
    location: 'Venice Beach Studio',
    image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=85&fit=crop',
    attendees: 18,
  },
  {
    title: 'Full Moon Ceremony',
    date: 'Aug 19, 2024',
    location: 'Malibu Bluffs',
    image: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800&q=85&fit=crop',
    attendees: 42,
  },
  {
    title: 'Yoga & Sacred Geometry',
    date: 'Jul 7, 2024',
    location: 'Downtown LA Loft',
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800&q=85&fit=crop',
    attendees: 31,
  },
]

function EventsGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <section style={{
      padding: '80px 80px 100px',
      borderTop: '1px solid rgba(201,169,110,0.14)',
      background: 'rgba(255,255,255,0.01)',
    }}>
      {/* Section header */}
      <div style={{ marginBottom: 52 }}>
        <p style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: 10,
          fontWeight: 300,
          letterSpacing: '0.38em',
          color: 'rgba(201,169,110,0.82)',
          textTransform: 'uppercase',
          marginBottom: 14,
        }}>
          Memories
        </p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 42,
          fontWeight: 300,
          letterSpacing: '0.04em',
          color: 'rgba(245,240,232,0.88)',
        }}>
          Past Gatherings
        </h2>
      </div>

      {/* Mosaic grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'auto auto',
        gap: 3,
      }}>
        {EVENTS.map((ev, i) => (
          <motion.div
            key={ev.title}
            whileHover={{ zIndex: 2 }}
            onClick={() => setLightbox(i)}
            style={{
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              aspectRatio: i === 0 ? '16/9' : '4/3',
              gridColumn: i === 0 ? '1 / 3' : undefined,
            }}
          >
            <motion.img
              src={ev.image}
              alt={ev.title}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.55) saturate(0.7)' }}
            />
            {/* Overlay on hover */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(5,4,3,0.85) 0%, transparent 55%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                padding: '20px 24px',
              }}
            >
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18,
                fontWeight: 300,
                color: 'rgba(245,240,232,0.95)',
                marginBottom: 4,
              }}>
                {ev.title}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: 9,
                  fontWeight: 300,
                  letterSpacing: '0.2em',
                  color: 'rgba(201,169,110,0.8)',
                  textTransform: 'uppercase',
                }}>
                  {ev.date}
                </span>
                <span style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: 9,
                  fontWeight: 300,
                  letterSpacing: '0.15em',
                  color: 'rgba(245,240,232,0.82)',
                  textTransform: 'uppercase',
                }}>
                  {ev.attendees} joined
                </span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
              style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(3,2,2,0.93)', backdropFilter: 'blur(12px)', cursor: 'zoom-out' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 401, maxWidth: 900, width: '90vw',
              }}
            >
              <img
                src={EVENTS[lightbox].image}
                alt={EVENTS[lightbox].title}
                style={{ width: '100%', maxHeight: '70vh', objectFit: 'cover', display: 'block', filter: 'brightness(0.85)' }}
              />
              <div style={{ padding: '24px 32px', background: 'rgba(10,9,8,0.97)', borderTop: '1px solid rgba(201,169,110,0.2)' }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 24,
                  fontWeight: 300,
                  color: 'rgba(245,240,232,0.92)',
                  marginBottom: 6,
                }}>
                  {EVENTS[lightbox].title}
                </p>
                <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.2em', color: 'rgba(201,169,110,0.75)', textTransform: 'uppercase' }}>
                    {EVENTS[lightbox].date}
                  </span>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.15em', color: 'rgba(245,240,232,0.76)', textTransform: 'uppercase' }}>
                    {EVENTS[lightbox].location}
                  </span>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.15em', color: 'rgba(245,240,232,0.68)', textTransform: 'uppercase' }}>
                    {EVENTS[lightbox].attendees} joined
                  </span>
                </div>
              </div>
              {/* Nav arrows */}
              {lightbox > 0 && (
                <button onClick={e => { e.stopPropagation(); setLightbox(lightbox - 1) }} style={{
                  position: 'absolute', left: -56, top: '40%',
                  background: 'none', border: '1px solid rgba(245,240,232,0.15)',
                  cursor: 'pointer', color: 'rgba(245,240,232,0.82)', width: 40, height: 40,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>‹</button>
              )}
              {lightbox < EVENTS.length - 1 && (
                <button onClick={e => { e.stopPropagation(); setLightbox(lightbox + 1) }} style={{
                  position: 'absolute', right: -56, top: '40%',
                  background: 'none', border: '1px solid rgba(245,240,232,0.15)',
                  cursor: 'pointer', color: 'rgba(245,240,232,0.82)', width: 40, height: 40,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>›</button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}

const categoryColors: Record<string, string> = {
  Yoga: '#c9a96e',
  Meditation: '#a78bfa',
  Breathwork: '#38bdf8',
  Nutrition: '#4ade80',
  Mindfulness: '#fb923c',
  Gratitude: '#f472b6',
}

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [composing, setComposing] = useState(false)
  const [draftText, setDraftText] = useState('')
  const [draftCategory, setDraftCategory] = useState('Mindfulness')
  const [posts, setPosts] = useState(INITIAL_POSTS)
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set())

  // 2.1.1 Keyboard — Escape closes compose modal
  useEffect(() => {
    if (!composing) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setComposing(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [composing])

  const visible = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory)

  function toggleLike(id: number) {
    const wasLiked = likedIds.has(id)
    setLikedIds(prev => {
      const next = new Set(prev)
      wasLiked ? next.delete(id) : next.add(id)
      return next
    })
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + (wasLiked ? -1 : 1) } : p))
  }

  function submitPost() {
    if (!draftText.trim()) return
    setPosts(prev => [{
      id: Date.now(),
      author: 'Gaia',
      role: 'Community Member',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
      time: 'Just now',
      category: draftCategory,
      content: draftText.trim(),
      likes: 0,
      comments: 0,
    }, ...prev])
    setDraftText('')
    setComposing(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1c1820' }}>
      {/* Hero */}
      <div style={{
        position: 'relative',
        height: '60vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <motion.div
          layoutId="panel-bg-community"
          transition={{ type: 'spring', stiffness: 70, damping: 18, mass: 1 }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&q=85&fit=crop)`,
            backgroundSize: 'cover',
            backgroundPosition: '50% 35%',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(15,35,20,0.72) 60%, #1c1820 100%)',
        }} />

        <motion.h1
          layoutId="panel-label-community"
          transition={{ type: 'spring', stiffness: 70, damping: 18, mass: 1 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(80px, 15vw, 200px)',
            fontWeight: 300,
            letterSpacing: '0.15em',
            color: 'rgba(245,240,232,0.1)',
            userSelect: 'none',
            pointerEvents: 'none',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          COMMUNITY
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1.6, ease: 'easeOut' }}
          style={{ position: 'absolute', top: -80, right: -80, zIndex: 2, pointerEvents: 'none' }}
        >
          <TriangleSymbol size={580} color="rgba(245,240,232,0.08)" isHovered={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{
            position: 'absolute',
            bottom: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            zIndex: 2,
          }}
        >
          <span style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: 11,
            fontWeight: 300,
            letterSpacing: '0.35em',
            color: 'rgba(201,169,110,0.7)',
            textTransform: 'uppercase',
          }}>
            Connect · Share · Grow
          </span>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 48,
            fontWeight: 300,
            letterSpacing: '0.1em',
            color: 'var(--white)',
          }}>
            The Gathering
          </h2>
        </motion.div>
      </div>

      <EventsSection />

      {/* Share button row */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '24px 80px',
        borderBottom: '1px solid rgba(201,169,110,0.14)',
      }}>
        <motion.button
          whileHover={{ scale: 1.02, borderColor: 'rgba(201,169,110,0.6)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setComposing(true)}
          style={{
            background: 'none',
            border: '1px solid rgba(201,169,110,0.5)',
            cursor: 'pointer',
            padding: '14px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,0.8)" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: 10,
            fontWeight: 300,
            letterSpacing: '0.28em',
            color: 'rgba(201,169,110,0.8)',
            textTransform: 'uppercase',
          }}>
            Share a thought
          </span>
        </motion.button>
      </div>

      {/* Category filter tabs */}
      <div style={{
        padding: '0 80px',
        borderBottom: '1px solid rgba(201,169,110,0.14)',
        display: 'flex',
        overflowX: 'auto',
      }}>
        {CATEGORIES.map(cat => {
          const active = cat === activeCategory
          const col = categoryColors[cat] || 'var(--gold-light)'
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: active ? `2px solid ${col}` : '2px solid transparent',
                cursor: 'pointer',
                padding: '20px 22px',
                fontFamily: "'Raleway', sans-serif",
                fontSize: 10,
                fontWeight: active ? 400 : 300,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: active ? col : 'rgba(245,240,232,0.68)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'color 0.2s',
              }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Post feed */}
      <div style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: '40px 40px 120px',
      }}>
        <AnimatePresence mode="popLayout">
          {visible.map((post, i) => {
            const isLiked = likedIds.has(post.id)
            const catColor = categoryColors[post.category] || '#c9a96e'
            return (
              <motion.article
                key={post.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.32, delay: i * 0.04 }}
                style={{
                  padding: '36px 0',
                  borderBottom: '1px solid rgba(245,240,232,0.05)',
                }}
              >
                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', overflow: 'hidden',
                    border: '1px solid rgba(201,169,110,0.4)', flexShrink: 0,
                  }}>
                    <img src={post.avatar} alt={post.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 17,
                      fontWeight: 400,
                      color: 'rgba(245,240,232,0.9)',
                      marginBottom: 2,
                    }}>
                      {post.author}
                    </p>
                    <p style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: 9,
                      fontWeight: 300,
                      letterSpacing: '0.2em',
                      color: 'rgba(201,169,110,0.7)',
                      textTransform: 'uppercase',
                    }}>
                      {post.role}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: 8,
                      fontWeight: 300,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: catColor,
                      border: `1px solid ${catColor}44`,
                      padding: '3px 10px',
                    }}>
                      {post.category}
                    </span>
                    <span style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: 9,
                      fontWeight: 300,
                      letterSpacing: '0.1em',
                      color: 'rgba(245,240,232,0.68)',
                    }}>
                      {post.time}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 19,
                  fontWeight: 300,
                  fontStyle: 'italic',
                  lineHeight: 1.75,
                  color: 'rgba(245,240,232,0.78)',
                  letterSpacing: '0.02em',
                  marginBottom: 26,
                }}>
                  {post.content}
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                  <motion.button
                    whileTap={{ scale: 0.82 }}
                    onClick={() => toggleLike(post.id)}
                    aria-label={isLiked ? `Unlike post by ${post.author}` : `Like post by ${post.author}`}
                    aria-pressed={isLiked}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8, padding: 0,
                    }}
                  >
                    <motion.svg
                      width="15" height="15" viewBox="0 0 24 24"
                      animate={{ fill: isLiked ? 'rgba(201,169,110,0.85)' : 'none' }}
                      transition={{ duration: 0.2 }}
                      stroke={isLiked ? 'rgba(201,169,110,0.85)' : 'rgba(245,240,232,0.52)'}
                      strokeWidth="1.5"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </motion.svg>
                    <span style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: 10,
                      fontWeight: 300,
                      letterSpacing: '0.1em',
                      color: isLiked ? 'rgba(201,169,110,0.85)' : 'rgba(245,240,232,0.52)',
                      transition: 'color 0.2s',
                    }}>
                      {post.likes}
                    </span>
                  </motion.button>

                  <button
                    aria-label={`${post.comments} comments on post by ${post.author}`}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8, padding: 0,
                    }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(245,240,232,0.52)" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span aria-hidden="true" style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: 10,
                      fontWeight: 300,
                      letterSpacing: '0.1em',
                      color: 'rgba(245,240,232,0.52)',
                    }}>
                      {post.comments}
                    </span>
                  </button>

                  <button
                    aria-label={`Share post by ${post.author}`}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8, padding: 0,
                      marginLeft: 'auto',
                    }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(245,240,232,0.2)" strokeWidth="1.5" strokeLinecap="round">
                      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  </button>
                </div>
              </motion.article>
            )
          })}
        </AnimatePresence>

        {visible.length === 0 && (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22,
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'rgba(245,240,232,0.72)',
            }}>
              No thoughts shared in this space yet.
            </p>
          </div>
        )}
      </div>

      {/* Past Events Gallery */}
      <EventsGallery />

      {/* Compose modal */}
      <AnimatePresence>
        {composing && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setComposing(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 300,
                background: 'rgba(5,5,4,0.82)', backdropFilter: 'blur(10px)',
              }}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Share a thought"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 301, width: 560,
                background: 'rgba(10,9,8,0.99)',
                border: '1px solid rgba(201,169,110,0.15)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.85)',
                padding: '40px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 26,
                  fontWeight: 300,
                  color: 'rgba(245,240,232,0.9)',
                }}>
                  Share a thought
                </h2>
                <button onClick={() => setComposing(false)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(245,240,232,0.52)', fontSize: 22, lineHeight: 1, padding: 4,
                }}>×</button>
              </div>

              {/* Category selector */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                {CATEGORIES.filter(c => c !== 'All').map(cat => {
                  const sel = cat === draftCategory
                  const col = categoryColors[cat]
                  return (
                    <button
                      key={cat}
                      onClick={() => setDraftCategory(cat)}
                      style={{
                        background: sel ? `${col}18` : 'none',
                        border: `1px solid ${sel ? col : 'rgba(245,240,232,0.1)'}`,
                        cursor: 'pointer',
                        padding: '5px 14px',
                        fontFamily: "'Raleway', sans-serif",
                        fontSize: 9,
                        fontWeight: 300,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: sel ? col : 'rgba(245,240,232,0.58)',
                        transition: 'all 0.18s',
                      }}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>

              <textarea
                autoFocus
                value={draftText}
                onChange={e => setDraftText(e.target.value)}
                placeholder="What are you noticing today?"
                rows={5}
                style={{
                  width: '100%',
                  background: 'rgba(245,240,232,0.03)',
                  border: '1px solid rgba(245,240,232,0.08)',
                  padding: '20px',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 18,
                  fontWeight: 300,
                  fontStyle: 'italic',
                  lineHeight: 1.7,
                  color: 'rgba(245,240,232,0.95)',
                  resize: 'none',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 14, marginTop: 20 }}>
                <button
                  onClick={() => setComposing(false)}
                  style={{
                    background: 'none', border: '1px solid rgba(245,240,232,0.1)',
                    cursor: 'pointer', padding: '10px 24px',
                    fontFamily: "'Raleway', sans-serif", fontSize: 10,
                    fontWeight: 300, letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'rgba(245,240,232,0.58)',
                  }}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={submitPost}
                  disabled={!draftText.trim()}
                  style={{
                    background: draftText.trim() ? 'rgba(201,169,110,0.2)' : 'transparent',
                    border: `1px solid ${draftText.trim() ? 'rgba(201,169,110,0.5)' : 'rgba(245,240,232,0.07)'}`,
                    cursor: draftText.trim() ? 'pointer' : 'default',
                    padding: '10px 32px',
                    fontFamily: "'Raleway', sans-serif", fontSize: 10,
                    fontWeight: 300, letterSpacing: '0.26em', textTransform: 'uppercase',
                    color: draftText.trim() ? 'rgba(201,169,110,0.9)' : 'rgba(245,240,232,0.18)',
                    transition: 'all 0.2s',
                  }}
                >
                  Post
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
