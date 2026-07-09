import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RishiLogo from './RishiLogo'
import MusicModal from './MusicModal'

interface NavbarProps {
  transparent?: boolean
  onHome?: () => void
  onNavigate?: (page: string) => void
}

export default function Navbar({ transparent = false, onHome, onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [musicOpen, setMusicOpen] = useState(false)

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <NavIcon label="Notifications">
            <BellIcon />
          </NavIcon>
          <NavIcon label="Music" onClick={() => setMusicOpen(o => !o)} active={musicOpen}>
            <MusicIcon />
          </NavIcon>
          <NavIcon label="Search">
            <SearchIcon />
          </NavIcon>
        </div>

        {/* Center logo */}
        <div
          style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
          onClick={onHome}
        >
          <RishiLogo size={34} variant="navbar" />
        </div>

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

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      <circle cx="18" cy="5" r="3" fill="#c9a96e" stroke="none"/>
    </svg>
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
