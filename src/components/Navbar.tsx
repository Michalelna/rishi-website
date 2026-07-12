import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MusicModal from './MusicModal'
import { wixClient } from '../lib/wix'

interface LiveNotification {
  id: string
  avatars: string[]
  text: React.ReactNode
  time: string
  image?: string
}

interface NavbarProps {
  transparent?: boolean
  onHome?: () => void
  onNavigate?: (page: string) => void
}

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000)
  if (secs < 60) return 'just now'
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return `${Math.floor(secs / 86400)}d ago`
}

export default function Navbar({ transparent = false, onHome, onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [musicOpen, setMusicOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [dismissed, setDismissed] = useState<string[]>([])
  const [notifications, setNotifications] = useState<LiveNotification[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchForumActivity() {
      setLoading(true)
      try {
        const { posts } = await wixClient.forumPosts.queryPosts()
          .descending('_createdDate')
          .limit(10)
          .find()

        const live: LiveNotification[] = (posts ?? []).map(post => {
          const author = post.owner
          const name = author?.nickname ?? author?.name ?? 'Someone'
          const avatar = author?.image?.url ?? ''
          const created = post._createdDate ? new Date(post._createdDate) : new Date()
          const excerpt = post.title ?? 'posted a new thread'

          return {
            id: post._id ?? String(Math.random()),
            avatars: avatar ? [avatar] : [],
            text: <><strong>{name}</strong> posted "{excerpt}"</>,
            time: timeAgo(created),
          }
        })

        setNotifications(live)
      } catch (err) {
        console.warn('[Rishi] Forum fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchForumActivity()
  }, [])

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 'var(--nav-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 48px',
          background: transparent
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)'
            : 'rgba(8,7,6,0.85)',
          backdropFilter: transparent ? 'none' : 'blur(12px)',
          borderBottom: transparent ? 'none' : '1px solid rgba(201,169,110,0.16)',
          transition: 'background 0.4s ease',
        }}
      >
        {/* Left icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, position: 'relative' }}>
          <NavIcon label="Notifications" onClick={() => setNotifOpen(o => !o)} active={notifOpen}>
            <BellIcon unread={notifications.length > 0 && dismissed.length < notifications.length} />
          </NavIcon>
          <NavIcon label="Music" onClick={() => setMusicOpen(o => !o)} active={musicOpen}>
            <MusicIcon />
          </NavIcon>
          <NavIcon label="Search">
            <SearchIcon />
          </NavIcon>
        </div>

        {/* Center wordmark */}
        <button
          onClick={onHome}
          style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 17,
            fontWeight: 300,
            letterSpacing: '0.22em',
            color: 'rgba(245,240,232,0.92)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            Rishi — Learn Yoga
          </span>
        </button>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <span style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: 13,
              fontWeight: 200,
              letterSpacing: '0.12em',
              color: 'rgba(245,240,232,0.9)',
            }}>
              Hello, Gaia
            </span>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1px solid rgba(201,169,110,0.4)',
              flexShrink: 0,
            }}>
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face"
                alt="User"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              opacity: 0.8,
            }}
            aria-label="Menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              style={{ display: 'block', width: 22, height: 1, background: 'var(--white)', transformOrigin: 'center' }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
              style={{ display: 'block', width: 22, height: 1, background: 'var(--white)' }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              style={{ display: 'block', width: 22, height: 1, background: 'var(--white)', transformOrigin: 'center' }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </motion.nav>

      <MusicModal open={musicOpen} onClose={() => setMusicOpen(false)} />

      {/* Notifications panel */}
      <AnimatePresence>
        {notifOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNotifOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 98 }}
            />

            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'fixed',
                top: 'calc(var(--nav-height) + 8px)',
                left: 32,
                width: 380,
                zIndex: 200,
                background: 'rgba(12,10,9,0.96)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(201,169,110,0.18)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 24px 16px',
                borderBottom: '1px solid rgba(245,240,232,0.06)',
              }}>
                <span style={{
                  fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300,
                  letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.7)',
                }}>Notifications</span>
                <button
                  onClick={() => setDismissed(notifications.map(n => n.id))}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300,
                    letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.65)',
                  }}
                >Mark all read</button>
              </div>

              {/* Items */}
              <div style={{ maxHeight: 480, overflowY: 'auto' }}>
                {loading && (
                  <div style={{
                    padding: '32px 24px', textAlign: 'center',
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 300,
                    fontStyle: 'italic', color: 'rgba(245,240,232,0.35)',
                  }}>Loading…</div>
                )}
                <AnimatePresence initial={false}>
                  {notifications.filter(n => !dismissed.includes(n.id)).map((n, i) => (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 14,
                        padding: '18px 24px',
                        borderBottom: '1px solid rgba(245,240,232,0.04)',
                        position: 'relative',
                      }}
                    >
                      {/* Avatars */}
                      <div style={{ display: 'flex', flexShrink: 0, marginTop: 2 }}>
                        {n.avatars.slice(0, 3).map((src, j) => (
                          <img
                            key={j}
                            src={src}
                            style={{
                              width: 36, height: 36, borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid rgba(12,10,9,0.9)',
                              marginLeft: j > 0 ? -10 : 0,
                            }}
                          />
                        ))}
                      </div>

                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 300,
                          lineHeight: 1.55, color: 'rgba(245,240,232,0.85)', marginBottom: n.image ? 10 : 4,
                        }}>{n.text}</p>
                        {n.image && (
                          <img
                            src={n.image}
                            style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 1, display: 'block', marginBottom: 6 }}
                          />
                        )}
                        <span style={{
                          fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300,
                          letterSpacing: '0.15em', color: 'rgba(201,169,110,0.55)',
                        }}>{n.time}</span>
                      </div>

                      {/* Dismiss */}
                      <button
                        onClick={() => setDismissed(d => [...d, n.id])}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'rgba(245,240,232,0.28)', padding: '2px 4px', flexShrink: 0,
                          fontSize: 16, lineHeight: 1,
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.7)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.28)')}
                      >×</button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {!loading && dismissed.length === notifications.length && notifications.length > 0 && (
                  <div style={{
                    padding: '32px 24px', textAlign: 'center',
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 300,
                    fontStyle: 'italic', color: 'rgba(245,240,232,0.28)',
                  }}>
                    You're all caught up
                  </div>
                )}
              </div>

              {/* Footer */}
              {!loading && dismissed.length < notifications.length && (
                <div style={{
                  padding: '14px 24px',
                  borderTop: '1px solid rgba(245,240,232,0.06)',
                  textAlign: 'center',
                }}>
                  <button style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300,
                    letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.45)',
                    transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.8)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.45)'}
                  >Show more</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99,
              background: 'rgba(8,7,6,0.96)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
              {['Home', 'Learning', 'Practice', 'Journal', 'Community'].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  onClick={e => {
                    e.preventDefault()
                    setMenuOpen(false)
                    if (item === 'Home') onHome?.()
                    else onNavigate?.(item.toLowerCase())
                  }}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 52,
                    fontWeight: 300,
                    letterSpacing: '0.15em',
                    color: 'rgba(245,240,232,0.95)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    lineHeight: 1,
                  }}
                  whileHover={{ color: 'var(--gold-light)', letterSpacing: '0.22em' }}
                >
                  {item}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function NavIcon({ children, label, onClick, active }: {
  children: React.ReactNode; label: string; onClick?: () => void; active?: boolean
}) {
  return (
    <motion.button
      aria-label={label}
      onClick={onClick}
      whileHover={{ scale: 1.15, opacity: 1 }}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: active ? 'var(--gold-light)' : 'rgba(245,240,232,0.95)',
        padding: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: active ? 1 : 0.65,
        transition: 'color 0.2s, opacity 0.2s',
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  )
}

function BellIcon({ unread }: { unread?: boolean }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      {unread && (
        <span style={{
          position: 'absolute', top: -2, right: -2,
          width: 7, height: 7, borderRadius: '50%',
          background: '#c9a96e',
          border: '1.5px solid rgba(8,7,6,0.85)',
        }} />
      )}
    </span>
  )
}

function MusicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  )
}
