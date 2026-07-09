import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const chakras = [
  {
    name: 'Crown',
    sanskrit: 'Sahasrara',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.5)',
    top: '8%',
    desc: 'Pure consciousness. The gateway to divine connection and universal awareness beyond the self.',
    element: 'Thought',
    mantra: 'OM',
  },
  {
    name: 'Third Eye',
    sanskrit: 'Ajna',
    color: '#818cf8',
    glow: 'rgba(129,140,248,0.5)',
    top: '17%',
    desc: 'Inner vision and intuition. The seat of perception, clarity, and higher knowing.',
    element: 'Light',
    mantra: 'SHAM',
  },
  {
    name: 'Throat',
    sanskrit: 'Vishuddha',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.5)',
    top: '26%',
    desc: 'Authentic expression. The bridge between heart and mind, voice of truth and creativity.',
    element: 'Space',
    mantra: 'HAM',
  },
  {
    name: 'Heart',
    sanskrit: 'Anahata',
    color: '#4ade80',
    glow: 'rgba(74,222,128,0.5)',
    top: '37%',
    desc: 'Unconditional love and compassion. The centre of all energy — where earth and sky meet.',
    element: 'Air',
    mantra: 'YAM',
  },
  {
    name: 'Solar Plexus',
    sanskrit: 'Manipura',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.5)',
    top: '48%',
    desc: 'Personal power and transformation. The fire of will, confidence, and inner strength.',
    element: 'Fire',
    mantra: 'RAM',
  },
  {
    name: 'Sacral',
    sanskrit: 'Svadhisthana',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.5)',
    top: '58%',
    desc: 'Creative life force and sensuality. The seat of emotion, pleasure, and fluid movement.',
    element: 'Water',
    mantra: 'VAM',
  },
  {
    name: 'Root',
    sanskrit: 'Muladhara',
    color: '#f87171',
    glow: 'rgba(248,113,113,0.5)',
    top: '68%',
    desc: 'Foundation and belonging. Grounded in the earth, safe, stable, and present.',
    element: 'Earth',
    mantra: 'LAM',
  },
]

export default function ChakraBody() {
  const [active, setActive] = useState<number | null>(null)

  const current = active !== null ? chakras[active] : null

  return (
    <div style={{
      padding: '100px 80px',
      background: '#080808',
      display: 'flex',
      alignItems: 'center',
      gap: 80,
      borderTop: '1px solid rgba(201,169,110,0.06)',
    }}>
      {/* Left: label */}
      <div style={{ flex: '0 0 200px' }}>
        <p style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: 10,
          fontWeight: 300,
          letterSpacing: '0.35em',
          color: 'rgba(201,169,110,0.8)',
          textTransform: 'uppercase',
          marginBottom: 20,
        }}>
          The Energy Body
        </p>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 36,
          fontWeight: 300,
          letterSpacing: '0.04em',
          color: 'rgba(245,240,232,0.9)',
          lineHeight: 1.2,
          marginBottom: 24,
        }}>
          Seven<br />Chakras
        </h3>
        <p style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: 12,
          fontWeight: 300,
          lineHeight: 1.9,
          color: 'rgba(245,240,232,0.5)',
          letterSpacing: '0.04em',
        }}>
          Move your cursor<br />to discover each<br />energy centre.
        </p>
      </div>

      {/* Centre: yogini body with chakra dots */}
      <div style={{
        position: 'relative',
        flex: '0 0 300px',
        height: 600,
      }}>
        {/* Yogini photo */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=600&q=90&fit=crop&crop=center)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          filter: 'brightness(0.28) saturate(0.5)',
        }} />
        {/* Radial vignette */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 90% at 50% 38%, transparent 35%, #080808 100%)',
        }} />

        {/* Spine line */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '7%',
          bottom: '28%',
          width: 1,
          transform: 'translateX(-50%)',
          background: 'linear-gradient(to bottom, rgba(245,240,232,0.04), rgba(245,240,232,0.1) 50%, rgba(245,240,232,0.04))',
        }} />

        {/* Chakra dots */}
        {chakras.map((c, i) => (
          <motion.div
            key={c.name}
            onHoverStart={() => setActive(i)}
            onHoverEnd={() => setActive(null)}
            style={{
              position: 'absolute',
              left: '50%',
              top: c.top,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            {/* Outer pulse ring */}
            <motion.div
              animate={active === i
                ? { scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }
                : { scale: [1, 1.5, 1], opacity: [0.25, 0, 0.25] }
              }
              transition={{
                duration: active === i ? 1.1 : 2.8,
                repeat: Infinity,
                ease: 'easeOut',
                delay: i * 0.2,
              }}
              style={{
                position: 'absolute',
                inset: -10,
                borderRadius: '50%',
                background: c.glow,
              }}
            />

            {/* Dot */}
            <motion.div
              animate={{
                scale: active === i ? 1.6 : 1,
                boxShadow: active === i
                  ? `0 0 24px 8px ${c.glow}, 0 0 48px 12px ${c.glow}`
                  : `0 0 6px 2px ${c.glow}`,
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: c.color,
                position: 'relative',
                zIndex: 2,
              }}
            />

            {/* Connector line to right */}
            <AnimatePresence>
              {active === i && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  exit={{ scaleX: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    left: '100%',
                    top: '50%',
                    width: 28,
                    height: 1,
                    background: c.color,
                    transformOrigin: 'left center',
                    opacity: 0.55,
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Right: chakra info panel */}
      <div style={{ flex: 1, minHeight: 340, display: 'flex', alignItems: 'center' }}>
        <AnimatePresence mode="wait">
          {current ? (
            <motion.div
              key={current.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 13,
                fontWeight: 300,
                letterSpacing: '0.5em',
                color: current.color,
                opacity: 0.7,
                textTransform: 'uppercase',
                marginBottom: 20,
              }}>
                {current.mantra}
              </p>

              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 52,
                fontWeight: 300,
                letterSpacing: '0.06em',
                color: 'rgba(245,240,232,0.95)',
                lineHeight: 1,
                marginBottom: 8,
              }}>
                {current.name}
              </h2>

              <p style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: 11,
                fontWeight: 300,
                letterSpacing: '0.3em',
                color: current.color,
                textTransform: 'uppercase',
                marginBottom: 32,
                opacity: 0.85,
              }}>
                {current.sanskrit}
              </p>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                  width: 48,
                  height: 2,
                  background: current.color,
                  marginBottom: 28,
                  transformOrigin: 'left center',
                  opacity: 0.7,
                }}
              />

              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18,
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 1.8,
                color: 'rgba(245,240,232,0.7)',
                maxWidth: 380,
                marginBottom: 32,
              }}>
                {current.desc}
              </p>

              <span style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: 9,
                fontWeight: 300,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: current.color,
                border: `1px solid ${current.color}`,
                padding: '4px 14px',
                opacity: 0.7,
              }}>
                {current.element}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {chakras.map((c, i) => (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 16 }}
                  >
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: c.color,
                      opacity: 0.5,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: 10,
                      fontWeight: 300,
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      color: 'rgba(245,240,232,0.35)',
                    }}>
                      {c.name}
                    </span>
                    <span style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 13,
                      fontWeight: 300,
                      fontStyle: 'italic',
                      color: 'rgba(245,240,232,0.2)',
                      letterSpacing: '0.05em',
                    }}>
                      {c.sanskrit}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
