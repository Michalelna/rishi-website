import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { wixClient } from '../lib/wix'

const SITE_ID = '4e2e4fc3-ae16-4d87-b6c9-454259cc95c3'

interface V1Event {
  id: string
  title: string
  description?: string
  scheduling?: {
    config?: { startDate?: string; endDate?: string; timeZoneId?: string }
    formatted?: string
    startDateFormatted?: string
    startTimeFormatted?: string
  }
  location?: { name?: string; type?: string }
  registration?: { type?: string; status?: string }
  mainImage?: string
  status?: string
}

interface RsvpForm {
  firstName: string
  lastName: string
  email: string
}

function formatDate(dateStr?: string) {
  if (!dateStr) return { day: '--', month: '---', time: '--:--' }
  const d = new Date(dateStr)
  return {
    day: d.getDate().toString().padStart(2, '0'),
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    time: d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
  }
}

async function fetchEvents(): Promise<V1Event[]> {
  const headers = await wixClient.auth.getAuthHeaders()
  const res = await fetch(
    `https://www.wixapis.com/events/v1/events?limit=10`,
    {
      headers: {
        ...headers,
        'wix-site-id': SITE_ID,
        'Content-Type': 'application/json',
      },
    }
  )
  if (!res.ok) throw new Error(`Events fetch failed: ${res.status}`)
  const data = await res.json()
  return data.events ?? []
}

async function createRsvp(eventId: string, form: RsvpForm) {
  const headers = await wixClient.auth.getAuthHeaders()
  const res = await fetch(`https://www.wixapis.com/events/v1/rsvp`, {
    method: 'POST',
    headers: {
      ...headers,
      'wix-site-id': SITE_ID,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      eventId,
      form: {
        inputValues: [
          { inputName: 'firstName', value: form.firstName },
          { inputName: 'lastName', value: form.lastName },
          { inputName: 'email', value: form.email },
        ],
      },
      status: 'YES',
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `RSVP failed: ${res.status}`)
  }
  return res.json()
}

export default function EventsSection() {
  const [events, setEvents] = useState<V1Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<V1Event | null>(null)
  const [form, setForm] = useState<RsvpForm>({ firstName: '', lastName: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
      .then(evts => setEvents(evts.filter(e => e.status !== 'CANCELED')))
      .catch(err => console.error('[EventsSection]', err))
      .finally(() => setLoading(false))
  }, [])

  async function handleRsvp(e: React.FormEvent) {
    e.preventDefault()
    if (!selected?.id) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await createRsvp(selected.id, form)
      setSubmitted(true)
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  function closeModal() {
    setSelected(null)
    setForm({ firstName: '', lastName: '', email: '' })
    setSubmitted(false)
    setSubmitError(null)
  }

  if (!loading && events.length === 0) return null

  return (
    <>
      <section style={{ padding: '80px 80px 64px', borderBottom: '1px solid rgba(201,169,110,0.14)' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 48, display: 'flex', alignItems: 'baseline', gap: 24 }}
        >
          <div style={{ width: 32, height: 1, background: 'rgba(201,169,110,0.5)', flexShrink: 0, marginBottom: 4 }} />
          <div>
            <span style={{
              fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300,
              letterSpacing: '0.35em', color: 'rgba(201,169,110,0.7)', textTransform: 'uppercase',
              display: 'block', marginBottom: 10,
            }}>Gatherings</span>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300,
              letterSpacing: '0.06em', color: 'var(--white)', margin: 0,
            }}>Upcoming Events</h2>
          </div>
        </motion.div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                height: 88, background: 'rgba(245,240,232,0.03)',
                border: '1px solid rgba(245,240,232,0.06)',
                opacity: 1 - i * 0.25,
              }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {events.map((event, i) => {
              const startDate = event.scheduling?.config?.startDate
              const { day, month, time } = formatDate(startDate)
              const locationName = event.location?.name
              const isFull = event.registration?.status === 'CLOSED_MANUALLY'

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  style={{ position: 'relative', overflow: 'hidden' }}
                >
                  {event.mainImage && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      backgroundImage: `url(${event.mainImage})`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                      opacity: 0.1,
                    }} />
                  )}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to right, rgba(28,24,32,0.97) 50%, rgba(28,24,32,0.65))',
                  }} />

                  <div style={{
                    position: 'relative', zIndex: 1,
                    padding: '28px 36px',
                    display: 'flex', alignItems: 'center', gap: 36,
                    border: '1px solid rgba(245,240,232,0.06)',
                  }}>
                    {/* Date block */}
                    <div style={{
                      flexShrink: 0, width: 56, textAlign: 'center',
                      borderRight: '1px solid rgba(201,169,110,0.2)', paddingRight: 28,
                    }}>
                      <div style={{
                        fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300,
                        color: 'var(--gold-light)', lineHeight: 1,
                      }}>{day}</div>
                      <div style={{
                        fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300,
                        letterSpacing: '0.3em', color: 'rgba(201,169,110,0.7)', textTransform: 'uppercase', marginTop: 4,
                      }}>{month}</div>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400,
                        letterSpacing: '0.04em', color: 'var(--white)', marginBottom: 8,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{event.title}</h3>
                      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        <span style={{
                          fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300,
                          letterSpacing: '0.2em', color: 'rgba(201,169,110,0.65)', textTransform: 'uppercase',
                        }}>{time}</span>
                        {locationName && (
                          <span style={{
                            fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300,
                            letterSpacing: '0.2em', color: 'rgba(245,240,232,0.4)', textTransform: 'uppercase',
                          }}>{locationName}</span>
                        )}
                        {isFull && (
                          <span style={{
                            fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300,
                            letterSpacing: '0.2em', color: 'rgba(240,100,100,0.65)', textTransform: 'uppercase',
                          }}>Full</span>
                        )}
                      </div>
                    </div>

                    {/* RSVP button */}
                    <motion.button
                      whileHover={isFull ? {} : { borderColor: 'rgba(201,169,110,0.7)' }}
                      whileTap={isFull ? {} : { scale: 0.97 }}
                      onClick={() => !isFull && setSelected(event)}
                      disabled={isFull}
                      style={{
                        flexShrink: 0, background: 'none',
                        border: `1px solid ${isFull ? 'rgba(245,240,232,0.1)' : 'rgba(201,169,110,0.4)'}`,
                        cursor: isFull ? 'default' : 'pointer',
                        padding: '12px 28px',
                        fontFamily: "'Raleway', sans-serif", fontSize: 10,
                        fontWeight: 300, letterSpacing: '0.28em', textTransform: 'uppercase',
                        color: isFull ? 'rgba(245,240,232,0.22)' : 'rgba(201,169,110,0.85)',
                        transition: 'all 0.25s',
                      }}
                    >
                      {isFull ? 'Full' : 'RSVP'}
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </section>

      {/* RSVP Modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              style={{
                position: 'fixed', inset: 0, zIndex: 100,
                background: 'rgba(10,8,14,0.82)', backdropFilter: 'blur(6px)',
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: 'fixed', inset: 0, zIndex: 101,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 24, pointerEvents: 'none',
              }}
            >
              <div style={{
                pointerEvents: 'all',
                background: '#221e28',
                border: '1px solid rgba(201,169,110,0.2)',
                width: '100%', maxWidth: 480,
                padding: '48px 44px',
                position: 'relative',
              }}>
                <button onClick={closeModal} style={{
                  position: 'absolute', top: 20, right: 20,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(245,240,232,0.4)', fontSize: 20, lineHeight: 1, padding: 4,
                }}>×</button>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      style={{ textAlign: 'center', padding: '16px 0' }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 16, color: 'var(--gold-light)' }}>✦</div>
                      <h3 style={{
                        fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300,
                        color: 'var(--white)', letterSpacing: '0.08em', marginBottom: 12,
                      }}>You're in</h3>
                      <p style={{
                        fontFamily: "'Raleway', sans-serif", fontSize: 12, fontWeight: 300,
                        letterSpacing: '0.15em', color: 'rgba(245,240,232,0.55)', lineHeight: 1.7,
                      }}>
                        A confirmation will be sent to<br />{form.email}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div style={{ marginBottom: 32 }}>
                        <span style={{
                          fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300,
                          letterSpacing: '0.35em', color: 'rgba(201,169,110,0.6)', textTransform: 'uppercase',
                          display: 'block', marginBottom: 10,
                        }}>RSVP</span>
                        <h3 style={{
                          fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300,
                          color: 'var(--white)', letterSpacing: '0.06em', margin: 0,
                        }}>{selected.title}</h3>
                        <p style={{
                          fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300,
                          letterSpacing: '0.18em', color: 'rgba(201,169,110,0.55)', textTransform: 'uppercase',
                          marginTop: 8,
                        }}>
                          {(() => {
                            const { month, day, time } = formatDate(selected.scheduling?.config?.startDate)
                            return `${month} ${day} · ${time}${selected.location?.name ? ` · ${selected.location.name}` : ''}`
                          })()}
                        </p>
                      </div>

                      <form onSubmit={handleRsvp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', gap: 12 }}>
                          {(['firstName', 'lastName'] as const).map(field => (
                            <div key={field} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                              <label style={labelStyle}>
                                {field === 'firstName' ? 'First name' : 'Last name'}
                              </label>
                              <input
                                required
                                value={form[field]}
                                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                                style={inputStyle}
                                onFocus={e => { e.target.style.borderColor = 'rgba(201,169,110,0.4)' }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(245,240,232,0.1)' }}
                              />
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <label style={labelStyle}>Email</label>
                          <input
                            required type="email"
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            style={inputStyle}
                            onFocus={e => { e.target.style.borderColor = 'rgba(201,169,110,0.4)' }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(245,240,232,0.1)' }}
                          />
                        </div>

                        {submitError && (
                          <p style={{
                            fontFamily: "'Raleway', sans-serif", fontSize: 11, fontWeight: 300,
                            color: 'rgba(240,100,100,0.8)', letterSpacing: '0.1em', margin: 0,
                          }}>{submitError}</p>
                        )}

                        <motion.button
                          type="submit" disabled={submitting}
                          whileHover={submitting ? {} : { borderColor: 'rgba(201,169,110,0.7)' }}
                          whileTap={submitting ? {} : { scale: 0.98 }}
                          style={{
                            marginTop: 8, background: 'none',
                            border: '1px solid rgba(201,169,110,0.45)',
                            cursor: submitting ? 'wait' : 'pointer',
                            padding: '16px',
                            fontFamily: "'Raleway', sans-serif", fontSize: 10,
                            fontWeight: 300, letterSpacing: '0.3em', textTransform: 'uppercase',
                            color: submitting ? 'rgba(201,169,110,0.4)' : 'rgba(201,169,110,0.9)',
                            transition: 'all 0.2s',
                          }}
                        >
                          {submitting ? 'Confirming…' : 'Confirm RSVP'}
                        </motion.button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(245,240,232,0.04)',
  border: '1px solid rgba(245,240,232,0.1)',
  padding: '12px 14px',
  color: 'var(--white)',
  fontFamily: "'Raleway', sans-serif", fontSize: 13,
  fontWeight: 300, outline: 'none',
  transition: 'border-color 0.2s',
  width: '100%',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300,
  letterSpacing: '0.3em', color: 'rgba(245,240,232,0.4)', textTransform: 'uppercase',
}
