import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PracticeSymbol } from '../components/Symbols'

const practices = [
  {
    title: 'Morning Flow',
    subtitle: 'Sun Salutation Series',
    duration: '30 min',
    type: 'Movement',
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800&q=80&fit=crop',
    color: 'rgba(40,80,100,0.6)',
  },
  {
    title: 'Deep Breathwork',
    subtitle: '4-7-8 Pranayama',
    duration: '15 min',
    type: 'Breath',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&fit=crop',
    color: 'rgba(20,40,70,0.6)',
  },
  {
    title: 'Chakra Meditation',
    subtitle: 'Root to Crown',
    duration: '45 min',
    type: 'Meditation',
    image: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=800&q=80&fit=crop',
    color: 'rgba(60,20,60,0.6)',
  },
]

export default function PracticePage() {
  const [active, setActive] = useState(1)

  return (
    <div style={{ background: '#1c1820', minHeight: '100vh' }}>
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
          layoutId="panel-bg-practice"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85&fit=crop)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(8,15,30,0.6) 60%, #1c1820 100%)',
        }} />

        <motion.h1
          layoutId="panel-label-practice"
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
          }}
        >
          PRACTICE
        </motion.h1>

        {/* Large symbol pinned to top-right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1.6, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <PracticeSymbol size={580} color="rgba(245,240,232,0.18)" />
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
            Move · Breathe · Be
          </span>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 48,
            fontWeight: 300,
            letterSpacing: '0.1em',
            color: 'var(--white)',
          }}>
            Practice
          </h2>
        </motion.div>
      </div>

      {/* Practice selector */}
      <div style={{ padding: '80px 80px 120px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 900,
          margin: '0 auto',
        }}>
          {practices.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 + 0.4 }}
              onClick={() => setActive(i)}
              style={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                borderRadius: 2,
                border: `1px solid ${active === i ? 'rgba(201,169,110,0.4)' : 'rgba(245,240,232,0.05)'}`,
                transition: 'border-color 0.3s ease',
              }}
            >
              <AnimatePresence>
                {active === i && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url(${p.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}
              </AnimatePresence>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: active === i ? p.color : 'rgba(10,10,10,0.9)',
                transition: 'background 0.5s ease',
              }} />

              <div style={{
                position: 'relative',
                zIndex: 2,
                padding: '32px 40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 48,
                    fontWeight: 300,
                    color: active === i ? 'rgba(245,240,232,0.15)' : 'rgba(245,240,232,0.06)',
                    lineHeight: 1,
                    minWidth: 40,
                    transition: 'color 0.3s',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 28,
                      fontWeight: 400,
                      letterSpacing: '0.05em',
                      color: active === i ? 'var(--white)' : 'rgba(245,240,232,0.95)',
                      marginBottom: 4,
                      transition: 'color 0.3s',
                    }}>
                      {p.title}
                    </h3>
                    <p style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: 11,
                      fontWeight: 300,
                      letterSpacing: '0.2em',
                      color: active === i ? 'rgba(201,169,110,0.8)' : 'rgba(245,240,232,0.72)',
                      textTransform: 'uppercase',
                      transition: 'color 0.3s',
                    }}>
                      {p.subtitle}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <span style={{
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: 10,
                    fontWeight: 300,
                    letterSpacing: '0.2em',
                    color: active === i ? 'rgba(201,169,110,0.7)' : 'rgba(245,240,232,0.72)',
                    textTransform: 'uppercase',
                    transition: 'color 0.3s',
                  }}>
                    {p.type} · {p.duration}
                  </span>
                  <AnimatePresence>
                    {active === i && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          border: '1px solid rgba(201,169,110,0.5)',
                          background: 'rgba(201,169,110,0.2)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--gold-light)',
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
