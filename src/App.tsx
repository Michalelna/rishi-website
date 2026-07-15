import { useEffect, lazy, Suspense } from 'react'
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion'
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import { TriangleSymbol, DiamondSymbol, PracticeSymbol } from './components/Symbols'
import { AuthProvider } from './lib/auth'
import OAuthCallback from './pages/OAuthCallback'
import { useWindowWidth } from './lib/useWindowWidth'

const LearningPage = lazy(() => import('./pages/LearningPage'))
const PracticePage = lazy(() => import('./pages/PracticePage'))
const CommunityPage = lazy(() => import('./pages/CommunityPage'))

type Page = 'home' | 'learning' | 'practice' | 'community'

const SPRING = { type: 'spring' as const, stiffness: 70, damping: 18, mass: 1 }

const pageEnter = { opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } }
const pageExit  = { opacity: 0, transition: { duration: 0.25, ease: 'easeIn' as const } }

const homePanels = [
  {
    id: 'learning' as Page,
    label: 'Learning',
    sublabel: 'Study & Discover',
    image: 'https://images.unsplash.com/photo-1571844088753-73ca0880bcd9?w=1200&q=55&fit=crop&fm=webp',
    bgPosition: 'center',
    tint: 'rgba(55,22,8,0.5)',
    symbol: 'diamond',
  },
  {
    id: 'practice' as Page,
    label: 'Practice',
    sublabel: 'Move & Breathe',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=55&fit=crop&fm=webp',
    bgPosition: 'center',
    tint: 'rgba(8,18,38,0.45)',
    symbol: 'circles',
  },
  {
    id: 'community' as Page,
    label: 'Community',
    sublabel: 'Connect & Grow',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=1200&q=55&fit=crop&fm=webp',
    bgPosition: '50% 35%',
    tint: 'rgba(15,35,20,0.5)',
    symbol: 'triangle',
  },
]

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Rishi — Ancient Wisdom, Modern Practice',
    description: 'Rishi is a yoga and wellness platform offering guided practices, Sanskrit learning, breathwork, meditation, and a mindful community.',
  },
  '/practice': {
    title: 'Practice — Move · Breathe · Be | Rishi',
    description: 'Guided yoga flows, pranayama breathwork, and chakra meditation. Morning routines and deep practice sessions for all levels.',
  },
  '/learning': {
    title: 'Learning — Ancient Wisdom, Modern Practice | Rishi',
    description: 'Explore Sanskrit, yoga philosophy, and the eight limbs of yoga. Study sacred texts and unlock the origins of yogic tradition.',
  },
  '/community': {
    title: 'The Gathering — Community | Rishi',
    description: 'Connect with a global community of yogis, mindfulness practitioners, and seekers. Share insights, inspire, and grow together.',
  },
}

function SymbolEl({ type, hovered }: { type: string; hovered: boolean }) {
  const color = hovered ? 'rgba(201,169,110,0.82)' : 'rgba(245,240,232,0.82)'
  if (type === 'triangle') return <TriangleSymbol size={200} color={color} isHovered={hovered} />
  if (type === 'circles')  return <PracticeSymbol size={220} color={color} isHovered={hovered} />
  if (type === 'diamond')  return <DiamondSymbol size={200} color={color} isHovered={hovered} />
  return null
}

function HomePageView() {
  const [hovered, setHovered] = useState<string | null>(null)
  const navigate = useNavigate()
  const isMobile = useWindowWidth() < 768

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {homePanels.map((panel, i) => {
        const isHov = hovered === panel.id
        const isOther = hovered !== null && hovered !== panel.id
        const flex = isHov ? 1.6 : isOther ? 0.7 : 1

        return (
          <motion.div
            key={panel.id}
            role="button"
            tabIndex={0}
            aria-label={`Enter ${panel.label} — ${panel.sublabel}`}
            onHoverStart={() => setHovered(panel.id)}
            onHoverEnd={() => setHovered(null)}
            onClick={() => navigate('/' + panel.id)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/' + panel.id) } }}
            animate={isMobile ? {} : { flex }}
            transition={{ duration: 0.75, ease: [0.43, 0.13, 0.23, 0.96] }}
            style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', flexShrink: 0, height: isMobile ? '33.33vh' : '100vh', flex: isMobile ? undefined : flex }}
          >
            <motion.div
              layoutId={`panel-bg-${panel.id}`}
              transition={SPRING}
              style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
            >
              <motion.div
                animate={{ scale: isHov ? 1.05 : 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${panel.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: panel.bgPosition,
                }}
              />
            </motion.div>
            <div style={{ position: 'absolute', inset: 0, background: panel.tint }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.55) 100%)',
            }} />

            {i < homePanels.length - 1 && (
              <div style={{
                position: 'absolute', right: 0, top: 0, bottom: 0, width: 1, zIndex: 2,
                background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.28) 50%, transparent)',
              }} />
            )}

            <motion.div
              layoutId={`panel-symbol-${panel.id}`}
              transition={SPRING}
              style={{
                position: 'absolute',
                top: 0, bottom: 140,
                left: 0, right: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3, pointerEvents: 'none',
              }}
            >
              <motion.div
                animate={{ opacity: isOther ? 0.15 : 1, scale: isHov ? 1.06 : 1 }}
                transition={{ duration: 0.5 }}
              >
                <SymbolEl type={panel.symbol} hovered={isHov} />
              </motion.div>
            </motion.div>

            <motion.div
              layoutId={`panel-label-${panel.id}`}
              transition={SPRING}
              style={{
                position: 'absolute', bottom: 68, left: 0, right: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, zIndex: 4,
              }}
            >
              <motion.span
                animate={{ opacity: isOther ? 0.22 : 1, y: isHov ? -12 : 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 30,
                  fontWeight: 300,
                  letterSpacing: '0.42em',
                  color: 'var(--white)',
                  textTransform: 'uppercase',
                }}
              >
                {panel.label}
              </motion.span>
              <AnimatePresence>
                {isHov && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: 10,
                      fontWeight: 300,
                      letterSpacing: '0.32em',
                      color: 'rgba(201,169,110,0.9)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {panel.sublabel}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {isHov && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute', bottom: 26, left: 0, right: 0,
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, zIndex: 4,
                  }}
                >
                  <div style={{ width: 22, height: 1, background: 'rgba(201,169,110,0.62)' }} />
                  <span style={{
                    fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300,
                    letterSpacing: '0.32em', color: 'rgba(201,169,110,0.90)', textTransform: 'uppercase',
                  }}>Enter</span>
                  <div style={{ width: 22, height: 1, background: 'rgba(201,169,110,0.62)' }} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

function AppInner() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isMobile = useWindowWidth() < 768

  useEffect(() => {
    document.getElementById('splash')?.remove()
  }, [])

  useEffect(() => {
    const meta = pageMeta[location.pathname] ?? pageMeta['/']
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  const pages = ['home', 'learning', 'practice', 'community']

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <Navbar
        transparent={isHome}
        onHome={() => navigate('/')}
        onNavigate={p => navigate(p === 'home' ? '/' : '/' + p)}
      />

      <main id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
        <Suspense fallback={null}>
        <AnimatePresence>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <motion.div key="home"
                initial={{ opacity: 0 }} animate={pageEnter} exit={pageExit}
                style={{ position: 'absolute', inset: 0 }}
              >
                <HomePageView />
              </motion.div>
            } />
            <Route path="/learning" element={
              <motion.div key="learning"
                initial={{ opacity: 0 }} animate={pageEnter} exit={pageExit}
                style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}
              >
                <LearningPage />
              </motion.div>
            } />
            <Route path="/practice" element={
              <motion.div key="practice"
                initial={{ opacity: 0 }} animate={pageEnter} exit={pageExit}
                style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}
              >
                <PracticePage />
              </motion.div>
            } />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="/community" element={
              <motion.div key="community"
                initial={{ opacity: 0 }} animate={pageEnter} exit={pageExit}
                style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}
              >
                <CommunityPage />
              </motion.div>
            } />
          </Routes>
        </AnimatePresence>
        </Suspense>
      </main>

      {!isHome && (
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          role="navigation"
          aria-label="Site navigation"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? 16 : 52,
            padding: isMobile ? '24px 20px' : '36px 80px',
            borderTop: '1px solid rgba(201,169,110,0.14)',
            background: '#1c1820',
          }}
        >
          {pages.map(p => {
            const href = p === 'home' ? '/' : '/' + p
            const active = location.pathname === href
            return (
              <Link
                key={p}
                to={href}
                aria-current={active ? 'page' : undefined}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: 10,
                  fontWeight: active ? 400 : 300,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: active ? 'var(--gold-light)' : 'rgba(245,240,232,0.76)',
                  transition: 'color 0.3s',
                  padding: '4px 0',
                  position: 'relative',
                  textDecoration: 'none',
                }}
              >
                {p}
                {active && (
                  <motion.div
                    layoutId="footer-indicator"
                    style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      height: 1, background: 'var(--gold)',
                    }}
                  />
                )}
              </Link>
            )
          })}
        </motion.footer>
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <LayoutGroup>
          <AppInner />
        </LayoutGroup>
      </BrowserRouter>
    </AuthProvider>
  )
}
