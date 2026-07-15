import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const memories = [
  {
    id: 1,
    date: 'June 2025',
    location: 'Topanga Canyon, CA',
    title: 'Winter Solstice Gathering',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=70&fit=crop&fm=webp',
    caption: 'Forty souls gathered under the oak trees as the year turned. A fire, a drum, a long exhale.',
    tags: ['Ceremony', 'Community'],
  },
  {
    id: 2,
    date: 'November 2024',
    location: 'Big Sur, CA',
    title: 'Silent Meditation Retreat',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=70&fit=crop&fm=webp',
    caption: 'Three days without words. The silence was louder than anything we had known.',
    tags: ['Meditation', 'Retreat'],
  },
  {
    id: 3,
    date: 'October 2024',
    location: 'Griffith Park, Los Angeles',
    title: 'Dawn Flow & Sound Bath',
    image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=70&fit=crop&fm=webp',
    caption: 'We moved together as the city woke. The singing bowls carried us back to stillness.',
    tags: ['Yoga', 'Sound Bath'],
  },
  {
    id: 4,
    date: 'September 2024',
    location: 'Venice Beach Studio',
    title: 'Breathwork Immersion',
    image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=70&fit=crop&fm=webp',
    caption: 'The breath is always the beginning. Eighteen people, one rhythm, endless depth.',
    tags: ['Breathwork'],
  },
  {
    id: 5,
    date: 'August 2024',
    location: 'Malibu Bluffs',
    title: 'Full Moon Ceremony',
    image: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800&q=70&fit=crop&fm=webp',
    caption: 'The moon was enormous. We chanted until we forgot what we had been carrying.',
    tags: ['Ceremony', 'Chanting'],
  },
  {
    id: 6,
    date: 'July 2024',
    location: 'Ojai, CA',
    title: 'Sunrise Pranayama',
    image: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=800&q=70&fit=crop&fm=webp',
    caption: 'We breathed in the valley mist. Each inhale a new beginning, each exhale a release.',
    tags: ['Pranayama', 'Dawn'],
  },
]

export default function MemoriesTab() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div style={{ padding: '48px 80px 120px' }}>
      {/* Intro line */}
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 17,
        fontWeight: 300,
        fontStyle: 'italic',
        color: 'rgba(245,240,232,0.91)',
        letterSpacing: '0.03em',
        marginBottom: 56,
        maxWidth: 480,
      }}>
        Moments held in time — gatherings, ceremonies, and the quiet spaces in between.
      </p>

      {/* Masonry-style grid */}
      <div style={{
        columns: 2,
        columnGap: 24,
      }}>
        {memories.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => setExpanded(expanded === m.id ? null : m.id)}
            style={{
              breakInside: 'avoid',
              marginBottom: 24,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Image */}
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <motion.img
                src={m.image}
                alt={m.title}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.5 }}
                style={{
                  width: '100%',
                  display: 'block',
                  objectFit: 'cover',
                  height: i % 3 === 0 ? 340 : i % 3 === 1 ? 260 : 300,
                  filter: 'brightness(0.72) saturate(0.8)',
                }}
              />
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 40%, rgba(10,8,12,0.88) 100%)',
              }} />

              {/* Bottom label */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px 22px',
              }}>
                <p style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: 9,
                  fontWeight: 300,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'rgba(201,169,110,0.92)',
                  marginBottom: 6,
                }}>
                  {m.date} · {m.location}
                </p>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 20,
                  fontWeight: 300,
                  letterSpacing: '0.04em',
                  color: 'rgba(245,240,232,0.9)',
                  lineHeight: 1.3,
                }}>
                  {m.title}
                </h3>
              </div>
            </div>

            {/* Expanded caption */}
            <AnimatePresence>
              {expanded === m.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    overflow: 'hidden',
                    background: 'rgba(245,240,232,0.03)',
                    borderBottom: '1px solid rgba(201,169,110,0.1)',
                  }}
                >
                  <div style={{ padding: '18px 22px' }}>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 15,
                      fontWeight: 300,
                      fontStyle: 'italic',
                      lineHeight: 1.75,
                      color: 'rgba(245,240,232,0.88)',
                      marginBottom: 14,
                    }}>
                      {m.caption}
                    </p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {m.tags.map(tag => (
                        <span key={tag} style={{
                          fontFamily: "'Raleway', sans-serif",
                          fontSize: 8,
                          fontWeight: 300,
                          letterSpacing: '0.22em',
                          textTransform: 'uppercase',
                          color: 'rgba(201,169,110,0.90)',
                          border: '1px solid rgba(201,169,110,0.25)',
                          padding: '2px 9px',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
