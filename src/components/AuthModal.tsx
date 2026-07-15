import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../lib/auth'
import { wixClient } from '../lib/wix'

interface Props {
  open: boolean
  onClose: () => void
}

type Screen = 'login' | 'verify' | 'success'

export default function AuthModal({ open, onClose }: Props) {
  const { login, verify } = useAuth()
  const [screen, setScreen] = useState<Screen>('login')
  const [socialBusy, setSocialBusy] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [stateToken, setStateToken] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function reset() {
    setScreen('login')
    setEmail('')
    setPassword('')
    setCode('')
    setStateToken('')
    setError('')
    setBusy(false)
  }

  function close() {
    reset()
    onClose()
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const res = await login(email, password)
    setBusy(false)
    if (res.error) { setError(res.error); return }
    if (res.needsVerification) { setStateToken(res.stateToken ?? ''); setScreen('verify'); return }
    setScreen('success')
    setTimeout(close, 1200)
  }

  async function handleSocialLogin() {
    setSocialBusy(true)
    try {
      const redirectUri = `${window.location.origin}/oauth-callback`
      const oAuthData = await (wixClient.auth as any).generateOAuthData(redirectUri, window.location.href)
      sessionStorage.setItem('wix_oauth_data', JSON.stringify(oAuthData))
      const { authUrl } = await (wixClient.auth as any).getAuthUrl(oAuthData)
      window.location.href = authUrl
    } catch {
      setSocialBusy(false)
      setError('Social login unavailable. Please use email/password.')
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const res = await verify(code, stateToken)
    setBusy(false)
    if (res.error) { setError(res.error); return }
    setScreen('success')
    setTimeout(close, 1200)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(5,5,4,0.78)', backdropFilter: 'blur(10px)' }}
          />

          {/* Modal */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 401, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <motion.div
              role="dialog" aria-modal="true" aria-label="Sign in"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                pointerEvents: 'all',
                width: 400,
                background: 'rgba(18,15,22,0.98)',
                border: '1px solid rgba(201,169,110,0.15)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.85)',
                padding: '44px 40px 40px',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36 }}>
                <div>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.38em', color: 'rgba(201,169,110,0.91)', textTransform: 'uppercase', marginBottom: 8 }}>
                    {screen === 'verify' ? 'Verify your email' : screen === 'success' ? 'Welcome back' : 'Member area'}
                  </p>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, letterSpacing: '0.04em', color: 'rgba(245,240,232,0.92)' }}>
                    {screen === 'verify' ? 'Enter code' : screen === 'success' ? '✓ Signed in' : 'Sign in'}
                  </h2>
                </div>
                <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,240,232,0.70)', fontSize: 20, lineHeight: 1, padding: 4, marginTop: 2 }}>×</button>
              </div>

              <AnimatePresence mode="wait">
                {screen === 'success' ? (
                  <motion.div key="success" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '12px 0 20px' }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, fontStyle: 'italic', color: 'rgba(245,240,232,0.87)' }}>
                      Returning to the gathering…
                    </p>
                  </motion.div>
                ) : screen === 'verify' ? (
                  <motion.form key="verify" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleVerify}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 300, fontStyle: 'italic', color: 'rgba(245,240,232,0.82)', marginBottom: 24 }}>
                      We sent a verification code to {email}. Enter it below.
                    </p>
                    <input
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      placeholder="Verification code"
                      autoFocus
                      style={inputStyle}
                    />
                    {error && <p style={errorStyle}>{error}</p>}
                    <button type="submit" disabled={busy || !code.trim()} style={submitStyle(!!code.trim() && !busy)}>
                      {busy ? 'Verifying…' : 'Verify'}
                    </button>
                  </motion.form>
                ) : (
                  <motion.form key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleLogin}>
                    {/* Social login */}
                    <button
                      type="button"
                      onClick={handleSocialLogin}
                      disabled={socialBusy}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                        width: '100%', background: 'rgba(245,240,232,0.06)',
                        border: '1px solid rgba(245,240,232,0.15)', cursor: 'pointer',
                        padding: '13px 0', marginBottom: 20,
                        fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300,
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: 'rgba(245,240,232,0.8)', transition: 'all 0.2s',
                        opacity: socialBusy ? 0.5 : 1,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {socialBusy ? 'Redirecting…' : 'Continue with Google'}
                    </button>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                      <div style={{ flex: 1, height: 1, background: 'rgba(245,240,232,0.1)' }} />
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.2em', color: 'rgba(245,240,232,0.89)', textTransform: 'uppercase' }}>or</span>
                      <div style={{ flex: 1, height: 1, background: 'rgba(245,240,232,0.1)' }} />
                    </div>

                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Email address"
                      autoFocus
                      style={{ ...inputStyle, marginBottom: 12 }}
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Password"
                      style={inputStyle}
                    />
                    {error && <p style={errorStyle}>{error}</p>}
                    <button type="submit" disabled={busy} style={submitStyle(!busy)}>
                      {busy ? 'Signing in…' : 'Sign in'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  background: 'rgba(245,240,232,0.04)',
  border: '1px solid rgba(245,240,232,0.1)',
  padding: '14px 18px',
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: 16,
  fontWeight: 300,
  color: 'rgba(245,240,232,0.9)',
  outline: 'none',
  boxSizing: 'border-box',
  marginBottom: 20,
}

const errorStyle: React.CSSProperties = {
  fontFamily: "'Raleway', sans-serif",
  fontSize: 10,
  fontWeight: 300,
  letterSpacing: '0.1em',
  color: 'rgba(248,113,113,0.85)',
  marginBottom: 16,
}

function submitStyle(active: boolean): React.CSSProperties {
  return {
    display: 'block',
    width: '100%',
    background: active ? 'rgba(201,169,110,0.12)' : 'transparent',
    border: `1px solid ${active ? 'rgba(201,169,110,0.5)' : 'rgba(245,240,232,0.08)'}`,
    cursor: active ? 'pointer' : 'default',
    padding: '13px 0',
    fontFamily: "'Raleway', sans-serif",
    fontSize: 10,
    fontWeight: 300,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: active ? 'rgba(201,169,110,0.9)' : 'rgba(245,240,232,0.2)',
    transition: 'all 0.2s',
  }
}
