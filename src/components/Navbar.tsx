import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MusicModal from './MusicModal'
import AuthModal from './AuthModal'
import { wixClient } from '../lib/wix'
import { useAuth } from '../lib/auth'

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
  const { member, logout } = useAuth()

  const [menuOpen, setMenuOpen] = useState(false)
  const [musicOpen, setMusicOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dismissed, setDismissed] = useState<string[]>([])
  const [notifications, setNotifications] = useState<LiveNotification[]>([])
  const [loading, setLoading] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const searchItems = [
    { label: 'Home', page: 'home', keywords: ['home', 'welcome', 'start'] },
    { label: 'Practice', page: 'practice', keywords: ['practice', 'yoga', 'asana', 'poses', 'flow'] },
    { label: 'Learning — Sanskrit', page: 'learning', keywords: ['sanskrit', 'language', 'learn', 'alphabet'] },
    { label: 'Learning — History', page: 'learning', keywords: ['history', 'ancient', 'tradition', 'origins'] },
    { label: 'Learning — Chakras', page: 'learning', keywords: ['chakra', 'energy', 'body', 'sahasrara', 'ajna', 'throat', 'heart'] },
    { label: 'Community', page: 'community', keywords: ['community', 'forum', 'post', 'people', 'connect'] },
    { label: 'Community — Journal', page: 'community', keywords: ['journal', 'reflection', 'diary', 'entry', 'personal', 'mood', 'practice log'] },
    { label: 'Sound Bath', page: 'practice', keywords: ['sound', 'bath', 'music', 'meditation', 'tone', 'frequency'] },
    { label: 'Breathwork', page: 'practice', keywords: ['breath', 'pranayama', 'breathing', 'inhale', 'exhale'] },
  ]

  const filteredItems = searchQuery.trim().length > 0
    ? searchItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keywords.some(k => k.includes(searchQuery.toLowerCase()))
      )
    : []

  useEffect(() => {
    async function fetchForumActivity() {
      setLoading(true)
      try {
        const result = await (wixClient.forumPosts.queryPosts() as any)
          .descending('_createdDate')
          .limit(10)
          .find()
        const posts = result?.posts ?? []

        const live: LiveNotification[] = posts.map((post: any) => {
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
          <NavIcon label="Search" onClick={() => { setSearchOpen(o => !o); setSearchQuery('') }} active={searchOpen}>
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
          {/* Member / Login */}
          {member ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(201,169,110,0.4)', flexShrink: 0, background: 'rgba(201,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {member.photoUrl
                  ? <img src={member.photoUrl} alt={member.nickname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: 'rgba(201,169,110,0.9)', textTransform: 'uppercase' }}>{member.nickname[0]}</span>
                }
              </div>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, fontWeight: 200, letterSpacing: '0.1em', color: 'rgba(245,240,232,0.92)' }}>{member.nickname}</span>
              <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.88)', padding: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.6)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.28)')}>
                Sign out
              </button>
            </div>
          ) : (
            <button onClick={() => setAuthOpen(true)} style={{ background: 'none', border: '1px solid rgba(201,169,110,0.3)', cursor: 'pointer', padding: '7px 18px', fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.92)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.7)'; e.currentTarget.style.color = 'rgba(201,169,110,1)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'; e.currentTarget.style.color = 'rgba(201,169,110,0.75)' }}>
              Sign in
            </button>
          )}
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
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 98 }}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() => searchInputRef.current?.focus()}
              style={{
                position: 'fixed',
                top: 'calc(var(--nav-height) + 8px)',
                left: 32,
                width: 360,
                zIndex: 200,
                background: 'rgba(12,10,9,0.96)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(201,169,110,0.18)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              {/* Input row */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', gap: 12, borderBottom: '1px solid rgba(245,240,232,0.06)' }}>
                <SearchIcon />
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search…"
                  autoFocus
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: 13,
                    fontWeight: 300,
                    letterSpacing: '0.08em',
                    color: 'rgba(245,240,232,0.9)',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,240,232,0.70)', fontSize: 16, lineHeight: 1, padding: 0 }}
                  >×</button>
                )}
              </div>

              {/* Results */}
              {filteredItems.length > 0 && (
                <div>
                  {filteredItems.map((item, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery('')
                        if (item.page === 'home') onHome?.()
                        else onNavigate?.(item.page)
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '13px 18px',
                        background: 'none',
                        border: 'none',
                        borderBottom: '1px solid rgba(245,240,232,0.04)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 16,
                        fontWeight: 300,
                        color: 'rgba(245,240,232,0.92)',
                        transition: 'color 0.15s, background 0.15s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = 'rgba(201,169,110,0.9)'
                        e.currentTarget.style.background = 'rgba(201,169,110,0.04)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = 'rgba(245,240,232,0.75)'
                        e.currentTarget.style.background = 'none'
                      }}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </div>
              )}

              {searchQuery.trim().length > 0 && filteredItems.length === 0 && (
                <div style={{
                  padding: '24px 18px',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 15,
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'rgba(245,240,232,0.89)',
                }}>No results for "{searchQuery}"</div>
              )}

              {searchQuery.trim().length === 0 && (
                <div style={{
                  padding: '24px 18px',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 15,
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'rgba(245,240,232,0.60)',
                }}>Try: chakras, breathwork, sanskrit…</div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                  letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.90)',
                }}>Notifications</span>
                <button
                  onClick={() => setDismissed(notifications.map(n => n.id))}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300,
                    letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.88)',
                  }}
                >Mark all read</button>
              </div>

              {/* Items */}
              <div style={{ maxHeight: 480, overflowY: 'auto' }}>
                {loading && (
                  <div style={{
                    padding: '32px 24px', textAlign: 'center',
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 300,
                    fontStyle: 'italic', color: 'rgba(245,240,232,0.70)',
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
                          color: 'rgba(245,240,232,0.88)', padding: '2px 4px', flexShrink: 0,
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
                    fontStyle: 'italic', color: 'rgba(245,240,232,0.88)',
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
                    letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.78)',
                    transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.8)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.45)')}
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
              {['Home', 'Learning', 'Practice', 'Community'].map((item, i) => (
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
