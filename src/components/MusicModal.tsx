import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Audio engine ─────────────────────────────────────────────────────────────

type AudioEngine = { stop: () => void; setVolume: (v: number) => void }

/** Sine oscillator at a given Hz with optional amplitude modulation for warmth */
function createToneEngine(ctx: AudioContext, hz: number, gain: GainNode): AudioEngine {
  const osc = ctx.createOscillator()
  const oscGain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.value = hz

  // Soft harmonic for richness
  const osc2 = ctx.createOscillator()
  const g2 = ctx.createGain()
  osc2.type = 'sine'
  osc2.frequency.value = hz * 2
  g2.gain.value = 0.12
  osc2.connect(g2)
  g2.connect(oscGain)

  // Slow amplitude wobble (like a bowl sustaining)
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 0.2
  lfoGain.gain.value = 0.04
  lfo.connect(lfoGain)
  lfoGain.connect(oscGain.gain)

  oscGain.gain.value = 0.5
  osc.connect(oscGain)
  oscGain.connect(gain)

  // Fade in
  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(gain.gain.value || 0.65, ctx.currentTime + 2)

  osc.start(); osc2.start(); lfo.start()

  return {
    stop() {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5)
      setTimeout(() => { osc.stop(); osc2.stop(); lfo.stop() }, 1600)
    },
    setVolume(v: number) { gain.gain.setTargetAtTime(v * 0.5, ctx.currentTime, 0.1) },
  }
}

/** Pink-ish noise buffer with a low-pass / band-pass filter shaped per sound */
function createNoiseEngine(
  ctx: AudioContext,
  gain: GainNode,
  shape: 'rain' | 'ocean' | 'wind'
): AudioEngine {
  // Generate 4-second white noise buffer, loop it
  const bufLen = ctx.sampleRate * 4
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
  const data = buf.getChannelData(0)
  // Pink noise approximation
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
  for (let i = 0; i < bufLen; i++) {
    const w = Math.random() * 2 - 1
    b0 = 0.99886 * b0 + w * 0.0555179
    b1 = 0.99332 * b1 + w * 0.0750759
    b2 = 0.96900 * b2 + w * 0.1538520
    b3 = 0.86650 * b3 + w * 0.3104856
    b4 = 0.55000 * b4 + w * 0.5329522
    b5 = -0.7616 * b5 - w * 0.0168980
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11
    b6 = w * 0.115926
  }

  const src = ctx.createBufferSource()
  src.buffer = buf
  src.loop = true

  const filter = ctx.createBiquadFilter()
  const filter2 = ctx.createBiquadFilter()

  if (shape === 'rain') {
    filter.type = 'bandpass'; filter.frequency.value = 4000; filter.Q.value = 0.5
    filter2.type = 'lowpass'; filter2.frequency.value = 8000
  } else if (shape === 'ocean') {
    filter.type = 'lowpass'; filter.frequency.value = 800; filter.Q.value = 1
    filter2.type = 'lowpass'; filter2.frequency.value = 400
    // LFO for wave rhythm
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.12  // ~12s per wave cycle
    lfoGain.gain.value = 0.3
    lfo.connect(lfoGain)
    lfoGain.connect(gain.gain)
    lfo.start()
  } else {
    // wind
    filter.type = 'lowpass'; filter.frequency.value = 600; filter.Q.value = 0.3
    filter2.type = 'highpass'; filter2.frequency.value = 80
  }

  src.connect(filter)
  filter.connect(filter2)
  filter2.connect(gain)

  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(gain.gain.value || 0.65, ctx.currentTime + 2.5)

  src.start()

  return {
    stop() {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5)
      setTimeout(() => src.stop(), 1600)
    },
    setVolume(v: number) { gain.gain.setTargetAtTime(v * 0.65, ctx.currentTime, 0.1) },
  }
}

// ── Track definitions ────────────────────────────────────────────────────────

const tracks = [
  { title: 'Tibetan Bowls',    subtitle: 'Deep resonance · 40 min',        color: '#c9a96e', freq: '432 Hz',     audio: { type: 'tone',  hz: 432 } },
  { title: 'Forest Rain',      subtitle: 'Gentle drops · continuous',       color: '#4ade80', freq: 'Natural',    audio: { type: 'noise', shape: 'rain' } },
  { title: 'Ocean Breath',     subtitle: 'Waves & tide · continuous',       color: '#38bdf8', freq: 'Natural',    audio: { type: 'noise', shape: 'ocean' } },
  { title: 'Om Chanting',      subtitle: 'Group chant · 20 min',            color: '#a78bfa', freq: '136.1 Hz',  audio: { type: 'tone',  hz: 136.1 } },
  { title: 'Wind & Silence',   subtitle: 'High mountain air · continuous',  color: '#94a3b8', freq: 'Natural',    audio: { type: 'noise', shape: 'wind' } },
  { title: 'Heartbeat of Earth', subtitle: 'Schumann resonance · loop',     color: '#fb923c', freq: '7.83 Hz',   audio: { type: 'tone',  hz: 7.83 } },
] as const

// ── Component ────────────────────────────────────────────────────────────────

interface MusicModalProps { open: boolean; onClose: () => void }

export default function MusicModal({ open, onClose }: MusicModalProps) {
  const [playing, setPlaying]         = useState<number | null>(null)
  const [volume, setVolume]           = useState(0.65)
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null)
  const closeRef  = useRef<HTMLButtonElement>(null)
  const ctxRef    = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const engineRef = useRef<AudioEngine | null>(null)

  // Keyboard / focus
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Stop audio when modal closes
  useEffect(() => {
    if (!open) stopCurrent()
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  function getCtx() {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
      masterRef.current = ctxRef.current.createGain()
      masterRef.current.gain.value = volume
      masterRef.current.connect(ctxRef.current.destination)
    }
    // Resume if suspended (browser autoplay policy)
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return { ctx: ctxRef.current, master: masterRef.current! }
  }

  function stopCurrent() {
    engineRef.current?.stop()
    engineRef.current = null
  }

  const playTrack = useCallback((i: number) => {
    stopCurrent()
    if (playing === i) { setPlaying(null); return }

    const { ctx, master } = getCtx()
    const trackGain = ctx.createGain()
    trackGain.gain.value = volume
    trackGain.connect(master)

    const t = tracks[i]
    if (t.audio.type === 'tone') {
      engineRef.current = createToneEngine(ctx, t.audio.hz, trackGain)
    } else {
      engineRef.current = createNoiseEngine(ctx, trackGain, t.audio.shape)
    }
    setPlaying(i)
  }, [playing, volume]) // eslint-disable-line react-hooks/exhaustive-deps

  // Volume changes propagate to running engine
  const handleVolume = (v: number) => {
    setVolume(v)
    engineRef.current?.setVolume(v)
    if (masterRef.current) masterRef.current.gain.setTargetAtTime(v, ctxRef.current!.currentTime, 0.05)
  }

  const current = playing !== null ? tracks[playing] : null

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(5,5,4,0.7)', backdropFilter: 'blur(8px)' }}
          />

          <motion.div
            role="dialog" aria-modal="true" aria-label="Sound Bath"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'fixed', top: 82, left: '50%', transform: 'translateX(-50%)',
              zIndex: 201, width: 420,
              background: 'rgba(28,24,32,0.97)',
              border: '1px solid rgba(201,169,110,0.15)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '28px 32px 20px',
              borderBottom: '1px solid rgba(201,169,110,0.1)',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.35em', color: 'rgba(201,169,110,0.72)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Ambient Sound
                </p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, letterSpacing: '0.06em', color: 'rgba(245,240,232,0.92)' }}>
                  Sound Bath
                </h2>
              </div>
              <button ref={closeRef} onClick={onClose} aria-label="Close sound bath"
                style={{ background: 'none', border: '1px solid rgba(245,240,232,0.12)', cursor: 'pointer', color: 'rgba(245,240,232,0.5)', padding: '6px 10px', lineHeight: 1, fontSize: 16, marginTop: 2 }}>
                ×
              </button>
            </div>

            {/* Now playing */}
            <AnimatePresence>
              {current && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{
                    padding: '14px 32px', background: 'rgba(201,169,110,0.05)',
                    borderBottom: '1px solid rgba(201,169,110,0.08)',
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, height: 16 }}>
                      {[0, 1, 2, 3].map(i => (
                        <motion.div key={i}
                          animate={{ scaleY: [0.3, 1, 0.5, 0.8, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
                          style={{ width: 2.5, height: 14, background: current.color, borderRadius: 1, transformOrigin: 'bottom', opacity: 0.8 }}
                        />
                      ))}
                    </div>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.2em', color: current.color, textTransform: 'uppercase', opacity: 0.9 }}>
                      Now playing · {current.title}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Track list */}
            <div style={{ padding: '8px 0' }}>
              {tracks.map((track, i) => {
                const isPlaying = playing === i
                const isHov = hoveredTrack === i
                return (
                  <motion.div key={track.title}
                    role="button" tabIndex={0}
                    aria-pressed={isPlaying}
                    aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                    onHoverStart={() => setHoveredTrack(i)}
                    onHoverEnd={() => setHoveredTrack(null)}
                    onClick={() => playTrack(i)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playTrack(i) } }}
                    animate={{ background: isPlaying ? 'rgba(201,169,110,0.06)' : isHov ? 'rgba(245,240,232,0.03)' : 'transparent' }}
                    transition={{ duration: 0.2 }}
                    style={{
                      display: 'flex', alignItems: 'center', padding: '14px 32px',
                      cursor: 'pointer', gap: 16,
                      borderLeft: isPlaying ? `2px solid ${track.color}` : '2px solid transparent',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <motion.div whileHover={{ scale: 1.1 }} style={{
                      width: 32, height: 32, borderRadius: '50%',
                      border: `1px solid ${isPlaying ? track.color : 'rgba(245,240,232,0.15)'}`,
                      background: isPlaying ? `${track.color}18` : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      transition: 'border-color 0.2s, background 0.2s',
                    }}>
                      {isPlaying ? (
                        <svg width="10" height="11" viewBox="0 0 10 11" fill="none">
                          <rect x="0" y="0" width="3" height="11" rx="1" fill={track.color} opacity="0.9"/>
                          <rect x="7" y="0" width="3" height="11" rx="1" fill={track.color} opacity="0.9"/>
                        </svg>
                      ) : (
                        <svg width="9" height="10" viewBox="0 0 9 10" fill="none" style={{ marginLeft: 1 }}>
                          <polygon points="0,0 9,5 0,10" fill={isHov ? 'rgba(245,240,232,0.7)' : 'rgba(245,240,232,0.35)'} />
                        </svg>
                      )}
                    </motion.div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 400, letterSpacing: '0.03em', color: isPlaying ? 'rgba(245,240,232,0.95)' : 'rgba(245,240,232,0.75)', marginBottom: 2, transition: 'color 0.2s' }}>
                        {track.title}
                      </p>
                      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.15em', color: 'rgba(245,240,232,0.35)', textTransform: 'uppercase' }}>
                        {track.subtitle}
                      </p>
                    </div>

                    <span style={{
                      fontFamily: "'Raleway', sans-serif", fontSize: 8, fontWeight: 300,
                      letterSpacing: '0.18em', textTransform: 'uppercase', flexShrink: 0,
                      color: isPlaying ? track.color : 'rgba(245,240,232,0.22)',
                      border: `1px solid ${isPlaying ? track.color + '55' : 'rgba(245,240,232,0.08)'}`,
                      padding: '3px 8px', transition: 'all 0.2s',
                    }}>
                      {track.freq}
                    </span>
                  </motion.div>
                )
              })}
            </div>

            {/* Volume */}
            <div style={{
              padding: '16px 32px 24px',
              borderTop: '1px solid rgba(201,169,110,0.08)',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="rgba(201,169,110,0.5)" strokeWidth="1.5" strokeLinecap="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
              <div style={{ flex: 1, position: 'relative', height: 2, background: 'rgba(245,240,232,0.08)', cursor: 'pointer' }}
                onClick={e => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                  handleVolume(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)))
                }}
              >
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${volume * 100}%`, background: 'rgba(201,169,110,0.6)', transition: 'width 0.1s' }} />
                <div style={{
                  position: 'absolute', left: `${volume * 100}%`, top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#c9a96e', border: '2px solid rgba(28,24,32,1)',
                }} />
              </div>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: '0.15em', color: 'rgba(245,240,232,0.3)', minWidth: 28, textAlign: 'right' }}>
                {Math.round(volume * 100)}
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
