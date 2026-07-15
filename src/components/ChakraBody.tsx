import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowWidth } from '../lib/useWindowWidth'

const chakras = [
  {
    name: 'Crown',
    sanskrit: 'Sahasrara',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.5)',
    bodyTop: '12%',   // % from top of the body image — top of head
    desc: 'Pure consciousness. The gateway to divine connection and universal awareness beyond the self.',
    element: 'Thought',
    mantra: 'OM',
  },
  {
    name: 'Third Eye',
    sanskrit: 'Ajna',
    color: '#818cf8',
    glow: 'rgba(129,140,248,0.5)',
    bodyTop: '24%',  // between eyebrows
    desc: 'Inner vision and intuition. The seat of perception, clarity, and higher knowing.',
    element: 'Light',
    mantra: 'SHAM',
  },
  {
    name: 'Throat',
    sanskrit: 'Vishuddha',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.5)',
    bodyTop: '34%',  // throat
    desc: 'Authentic expression. The bridge between heart and mind, voice of truth and creativity.',
    element: 'Space',
    mantra: 'HAM',
  },
  {
    name: 'Heart',
    sanskrit: 'Anahata',
    color: '#4ade80',
    glow: 'rgba(74,222,128,0.5)',
    bodyTop: '46%',  // centre of chest
    desc: 'Unconditional love and compassion. The centre of all energy — where earth and sky meet.',
    element: 'Air',
    mantra: 'YAM',
  },
  {
    name: 'Solar Plexus',
    sanskrit: 'Manipura',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.5)',
    bodyTop: '58%',  // upper abdomen / solar plexus
    desc: 'Personal power and transformation. The fire of will, confidence, and inner strength.',
    element: 'Fire',
    mantra: 'RAM',
  },
  {
    name: 'Sacral',
    sanskrit: 'Svadhisthana',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.5)',
    bodyTop: '69%',  // lower abdomen / sacral
    desc: 'Creative life force and sensuality. The seat of emotion, pleasure, and fluid movement.',
    element: 'Water',
    mantra: 'VAM',
  },
  {
    name: 'Root',
    sanskrit: 'Muladhara',
    color: '#f87171',
    glow: 'rgba(248,113,113,0.5)',
    bodyTop: '82%',  // base of spine / top of crossed legs
    desc: 'Foundation and belonging. Grounded in the earth, safe, stable, and present.',
    element: 'Earth',
    mantra: 'LAM',
  },
]

export default function ChakraBody() {
  const [active, setActive] = useState<number | null>(null)
  const isMobile = useWindowWidth() < 768
  const BODY_HEIGHT = 640

  return (
    <div style={{
      padding: isMobile ? '60px 16px' : '100px 80px',
      background: '#1c1820',
      borderTop: '1px solid rgba(201,169,110,0.06)',
    }}>
      {/* Section header */}
      <div style={{ marginBottom: 64 }}>
        <p style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: 10,
          fontWeight: 300,
          letterSpacing: '0.38em',
          color: 'rgba(201,169,110,0.94)',
          textTransform: 'uppercase',
          marginBottom: 14,
        }}>The Energy Body</p>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 42,
          fontWeight: 300,
          letterSpacing: '0.04em',
          color: 'rgba(245,240,232,0.88)',
        }}>Seven Chakras</h3>
      </div>

      {/* Main layout: body + labels */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 0, alignItems: 'flex-start' }}>

        {/* Body image column */}
        <div style={{
          position: 'relative',
          width: isMobile ? '100%' : 340,
          height: BODY_HEIGHT,
          flexShrink: 0,
        }}>
          {/* Photo */}
          <img
            src="https://cdn.mos.cms.futurecdn.net/eBKx8m8rFfSPHmaqxfQMWF-1000-80.jpg.webp"
            alt="Meditating figure"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
            }}
          />

          {/* Dramatic rim-light layer — warm gold glow from below */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 60% 40% at 50% 90%, rgba(201,169,110,0.18) 0%, transparent 70%)',
            mixBlendMode: 'screen',
          }} />

          {/* Cool top-light */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 50% 30% at 50% 0%, rgba(180,200,255,0.08) 0%, transparent 70%)',
            mixBlendMode: 'screen',
          }} />

          {/* Chakra color light — illuminates body in the active chakra's color */}
          <AnimatePresence>
            {active !== null && (
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(ellipse 90% 55% at 50% ${chakras[active].bodyTop}, ${chakras[active].color}55 0%, ${chakras[active].color}22 40%, transparent 70%)`,
                  mixBlendMode: 'screen',
                  pointerEvents: 'none',
                  zIndex: 5,
                }}
              />
            )}
          </AnimatePresence>

          {/* Vignette — fades into page colour at edges */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 70% 90% at 50% 42%, transparent 25%, #1c1820 90%)',
            zIndex: 6,
          }} />

          {/* Spine line */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '10%',
            bottom: '30%',
            width: 1,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(to bottom, rgba(245,240,232,0.03), rgba(245,240,232,0.12) 50%, rgba(245,240,232,0.03))',
          }} />

          {/* Chakra dots on body */}
          {chakras.map((c, i) => (
            <motion.div
              key={c.name}
              onHoverStart={() => setActive(i)}
              onHoverEnd={() => setActive(null)}
              onClick={() => setActive(active === i ? null : i)}
              style={{
                position: 'absolute',
                left: '50%',
                top: c.bodyTop,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              {/* Pulse ring */}
              <motion.div
                animate={active === i
                  ? { scale: [1, 2.6, 1], opacity: [0.8, 0, 0.8] }
                  : { scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }
                }
                transition={{
                  duration: active === i ? 1.0 : 3,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: i * 0.25,
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
                  scale: active === i ? 1.7 : 1,
                  boxShadow: active === i
                    ? `0 0 20px 6px ${c.glow}, 0 0 40px 10px ${c.glow}`
                    : `0 0 5px 2px ${c.glow}`,
                }}
                transition={{ duration: 0.25 }}
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: '50%',
                  background: c.color,
                  position: 'relative',
                  zIndex: 2,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Connector + labels column — hidden on mobile */}
        {!isMobile && (
        <div style={{
          position: 'relative',
          flex: 1,
          height: BODY_HEIGHT,
        }}>
          {chakras.map((c, i) => {
            const isActive = active === i
            // Match the vertical position of the dot on the body
            const topPct = parseFloat(c.bodyTop)
            const topPx = (topPct / 100) * BODY_HEIGHT

            return (
              <motion.div
                key={c.name}
                onHoverStart={() => setActive(i)}
                onHoverEnd={() => setActive(null)}
                onClick={() => setActive(active === i ? null : i)}
                style={{
                  position: 'absolute',
                  top: topPx,
                  left: -170,
                  right: 0,
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0,
                  zIndex: 10,
                }}
              >
                {/* Horizontal connector line — spans from body dot to label */}
                <motion.div
                  animate={{ opacity: isActive ? 0.9 : 0.4 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    width: 220,
                    height: 1,
                    background: c.color,
                    flexShrink: 0,
                  }}
                />

                {/* Small dot on connector */}
                <motion.div
                  animate={{ scale: isActive ? 1.4 : 1, opacity: isActive ? 1 : 0.5 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: c.color,
                    flexShrink: 0,
                    margin: '0 10px',
                  }}
                />

                {/* Label */}
                <div>
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.div
                        key="expanded"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                          <span style={{
                            fontFamily: "'Raleway', sans-serif",
                            fontSize: 10,
                            fontWeight: 300,
                            letterSpacing: '0.28em',
                            textTransform: 'uppercase',
                            color: c.color,
                          }}>{c.name}</span>
                          <span style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 13,
                            fontWeight: 300,
                            fontStyle: 'italic',
                            color: 'rgba(245,240,232,0.78)',
                            letterSpacing: '0.05em',
                          }}>{c.sanskrit}</span>
                          <span style={{
                            fontFamily: "'Raleway', sans-serif",
                            fontSize: 8,
                            fontWeight: 300,
                            letterSpacing: '0.3em',
                            color: c.color,
                            opacity: 0.7,
                            border: `1px solid ${c.color}`,
                            padding: '2px 8px',
                          }}>{c.mantra}</span>
                        </div>
                        <p style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 15,
                          fontWeight: 300,
                          fontStyle: 'italic',
                          lineHeight: 1.7,
                          color: 'rgba(245,240,232,0.85)',
                          maxWidth: 360,
                        }}>{c.desc}</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}
                      >
                        <span style={{
                          fontFamily: "'Raleway', sans-serif",
                          fontSize: 10,
                          fontWeight: 300,
                          letterSpacing: '0.25em',
                          textTransform: 'uppercase',
                          color: 'rgba(245,240,232,0.70)',
                        }}>{c.name}</span>
                        <span style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 13,
                          fontWeight: 300,
                          fontStyle: 'italic',
                          color: 'rgba(245,240,232,0.18)',
                          letterSpacing: '0.05em',
                        }}>{c.sanskrit}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>
        )}
      </div>

      {/* Mobile chakra labels list */}
      {isMobile && (
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {chakras.map((c, i) => (
            <motion.div
              key={c.name}
              onClick={() => setActive(active === i ? null : i)}
              style={{
                cursor: 'pointer',
                padding: '14px 16px',
                border: `1px solid ${active === i ? c.color + '66' : 'rgba(245,240,232,0.06)'}`,
                background: active === i ? `${c.color}0a` : 'transparent',
                transition: 'border-color 0.2s, background 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: active === i ? 8 : 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.28em', textTransform: 'uppercase', color: c.color }}>{c.name}</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontWeight: 300, fontStyle: 'italic', color: 'rgba(245,240,232,0.60)' }}>{c.sanskrit}</span>
                <span style={{ marginLeft: 'auto', fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: '0.25em', color: c.color, border: `1px solid ${c.color}`, padding: '2px 6px' }}>{c.mantra}</span>
              </div>
              {active === i && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 300, fontStyle: 'italic', lineHeight: 1.7, color: 'rgba(245,240,232,0.82)', paddingLeft: 22 }}>{c.desc}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
