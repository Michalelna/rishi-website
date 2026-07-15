import { useState } from 'react'
import { motion } from 'framer-motion'

const entries = [
  {
    date: 'June 14, 2025',
    day: 'Saturday',
    title: 'Finding stillness in the morning light',
    excerpt: 'Today I sat with my breath for twenty minutes before the sun had fully risen. There was a quality of silence I had not encountered before—not the absence of sound, but a presence of peace.',
    mood: 'Peaceful',
    practices: ['Morning Flow', 'Meditation'],
  },
  {
    date: 'June 11, 2025',
    day: 'Wednesday',
    title: 'On resistance and letting go',
    excerpt: 'The body knows things the mind refuses. I noticed resistance today in the hip openers—a holding, a guarding. The teacher reminded us: where there is tension, there is a story.',
    mood: 'Reflective',
    practices: ['Yin Yoga', 'Breathwork'],
  },
  {
    date: 'June 8, 2025',
    day: 'Sunday',
    title: 'The root chakra and belonging',
    excerpt: 'We worked with Muladhara today. I planted my feet and felt, for the first time in months, that I belonged here. Not just in the studio—but in my own skin.',
    mood: 'Grounded',
    practices: ['Chakra Work'],
  },
]

export default function JournalTab() {
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null)

  return (
    <div>
      {/* New entry CTA */}
      <div style={{ padding: '40px 80px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ borderColor: 'rgba(201,169,110,0.5)', color: 'var(--gold-light)' }}
          style={{
            background: 'none',
            border: '1px solid rgba(201,169,110,0.2)',
            cursor: 'pointer',
            padding: '10px 24px',
            fontFamily: "'Raleway', sans-serif",
            fontSize: 10,
            fontWeight: 300,
            letterSpacing: '0.3em',
            color: 'rgba(245,240,232,0.91)',
            textTransform: 'uppercase',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 100, lineHeight: 1, marginTop: -1 }}>+</span>
          New Entry
        </motion.button>
      </div>

      {/* Entries */}
      <div style={{ padding: '48px 80px 120px', maxWidth: 800, margin: '0 auto 0 80px' }}>
        {entries.map((entry, i) => (
          <motion.article
            key={entry.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 + 0.1 }}
            onClick={() => setExpandedEntry(expandedEntry === i ? null : i)}
            style={{
              cursor: 'pointer',
              padding: '40px 0',
              borderBottom: '1px solid rgba(245,240,232,0.06)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.25em', color: 'rgba(201,169,110,0.86)', textTransform: 'uppercase' }}>
                {entry.day}
              </span>
              <div style={{ width: 30, height: 1, background: 'rgba(201,169,110,0.2)' }} />
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.15em', color: 'rgba(245,240,232,0.92)' }}>
                {entry.date}
              </span>
            </div>

            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, letterSpacing: '0.02em', color: 'rgba(245,240,232,0.9)', lineHeight: 1.3, marginBottom: 16 }}>
              {entry.title}
            </h3>

            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 16,
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 1.8,
              color: expandedEntry === i ? 'rgba(245,240,232,0.9)' : 'rgba(245,240,232,0.76)',
              maxHeight: expandedEntry === i ? 500 : 52,
              overflow: 'hidden',
              transition: 'max-height 0.5s ease, color 0.3s',
            }}>
              {entry.excerpt}
            </p>

            <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.2em', color: 'rgba(201,169,110,0.9)', textTransform: 'uppercase', border: '1px solid rgba(201,169,110,0.5)', padding: '3px 10px' }}>
                {entry.mood}
              </span>
              {entry.practices.map(p => (
                <span key={p} style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.2em', color: 'rgba(245,240,232,0.82)', textTransform: 'uppercase', border: '1px solid rgba(245,240,232,0.2)', padding: '3px 10px' }}>
                  {p}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
