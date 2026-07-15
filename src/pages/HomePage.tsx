import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TriangleSymbol, ConcentricCircles, DiamondSymbol } from '../components/Symbols'

const panels = [
  {
    id: 'community',
    label: 'Community',
    sublabel: 'Connect & Grow',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=60&fit=crop&fm=webp',
    symbol: 'triangle',
    tint: 'rgba(20,40,25,0.45)',
  },
  {
    id: 'practice',
    label: 'Practice',
    sublabel: 'Move & Breathe',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=60&fit=crop&fm=webp',
    symbol: 'circles',
    tint: 'rgba(10,20,40,0.4)',
  },
  {
    id: 'learning',
    label: 'Learning',
    sublabel: 'Study & Discover',
    image: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=800&q=60&fit=crop&fm=webp',
    symbol: 'diamond',
    tint: 'rgba(60,25,10,0.45)',
  },
]

function Symbol({ type, size, hovered }: { type: string; size: number; hovered: boolean }) {
  const color = hovered ? 'rgba(201,169,110,0.7)' : 'rgba(245,240,232,0.45)'
  if (type === 'triangle') return <TriangleSymbol size={size} color={color} isHovered={hovered} />
  if (type === 'circles') return <ConcentricCircles size={size} color={color} isHovered={hovered} />
  if (type === 'diamond') return <DiamondSymbol size={size} color={color} isHovered={hovered} />
  return null
}

export default function HomePage() {
  const [hovered, setHovered] = useState<string | null>(null)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <div className="home-panels" style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <style>{`
        @media (max-width: 767px) {
          .home-panels { flex-direction: column !important; }
          .home-panel { flex: 1 !important; min-height: 0 !important; }
          .home-panel-divider { display: none !important; }
          .home-panel-label { font-size: 22px !important; letter-spacing: 0.28em !important; }
          .home-panel-bottom { bottom: 28px !important; }
        }
      `}</style>
      {panels.map((panel, i) => {
        const isHovered = hovered === panel.id
        const isOtherHovered = hovered !== null && hovered !== panel.id
        const flex = isMobile ? 1 : (isHovered ? 1.6 : isOtherHovered ? 0.7 : 1)

        return (
          <motion.div
            key={panel.id}
            className="home-panel"
            onHoverStart={() => setHovered(panel.id)}
            onHoverEnd={() => setHovered(null)}
            animate={{ flex }}
            transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
            style={{
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {/* Background image */}
            <motion.div
              animate={{ scale: isHovered ? 1.04 : 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${panel.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Color tint overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: panel.tint,
            }} />

            {/* Dark vignette at bottom */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.65) 100%)',
            }} />

            {/* Vertical dividers */}
            {i < panels.length - 1 && (
              <div className="home-panel-divider" style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: 1,
                background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.25) 50%, transparent)',
                zIndex: 2,
              }} />
            )}

            {/* Symbol */}
            <motion.div
              animate={{
                opacity: isOtherHovered ? 0.2 : 1,
                scale: isHovered ? 1.08 : 1,
              }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -58%)',
                zIndex: 3,
                pointerEvents: 'none',
              }}
            >
              <Symbol type={panel.symbol} size={220} hovered={isHovered} />
            </motion.div>

            {/* Label */}
            <motion.div
              animate={{
                opacity: isOtherHovered ? 0.3 : 1,
                y: isHovered ? -8 : 0,
              }}
              transition={{ duration: 0.5 }}
              className="home-panel-bottom"
              style={{
                position: 'absolute',
                bottom: 60,
                left: 0,
                right: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                zIndex: 4,
              }}
            >
              <span className="home-panel-label" style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 32,
                fontWeight: 300,
                letterSpacing: '0.35em',
                color: 'var(--white)',
                textTransform: 'uppercase',
              }}>
                {panel.label}
              </span>
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: 11,
                      fontWeight: 300,
                      letterSpacing: '0.25em',
                      color: 'rgba(201,169,110,0.85)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {panel.sublabel}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Hover CTA */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    bottom: 24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div style={{
                    width: 28,
                    height: 1,
                    background: 'rgba(201,169,110,0.6)',
                  }} />
                  <span style={{
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: 10,
                    fontWeight: 300,
                    letterSpacing: '0.3em',
                    color: 'rgba(201,169,110,0.75)',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}>
                    Enter
                  </span>
                  <div style={{
                    width: 28,
                    height: 1,
                    background: 'rgba(201,169,110,0.6)',
                  }} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}

      {/* Bottom center ornament */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: 0,
        zIndex: 10,
        pointerEvents: 'none',
      }}>
      </div>
    </div>
  )
}
