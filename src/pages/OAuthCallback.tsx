import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { wixClient } from '../lib/wix'
import { useAuth } from '../lib/auth'

const TOKENS_KEY = 'wix_tokens'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const { rehydrateFromTokens } = useAuth() as any
  const [error, setError] = useState('')

  useEffect(() => {
    async function handleCallback() {
      try {
        const oAuthDataRaw = sessionStorage.getItem('wix_oauth_data')
        if (!oAuthDataRaw) { navigate('/'); return }
        sessionStorage.removeItem('wix_oauth_data')

        const oAuthData = JSON.parse(oAuthDataRaw)
        const { code, state } = Object.fromEntries(new URLSearchParams(window.location.search))

        const tokens = await (wixClient.auth as any).getMemberTokens(code, state, oAuthData)
        wixClient.auth.setTokens(tokens)
        localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))

        if (rehydrateFromTokens) rehydrateFromTokens(tokens)

        // Navigate to where the user came from (stored in oAuthData.originalUri) or home
        const returnTo = oAuthData.originalUri ?? '/'
        navigate(returnTo.replace(window.location.origin, '') || '/')
      } catch (e: any) {
        setError(e?.message ?? 'Login failed')
      }
    }
    handleCallback()
  }, [])

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#1c1820', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: 'rgba(245,240,232,0.90)' }}>Sign in failed</p>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: 'rgba(248,113,113,0.8)', letterSpacing: '0.1em' }}>{error}</p>
        <button onClick={() => navigate('/')} style={{ marginTop: 12, background: 'none', border: '1px solid rgba(201,169,110,0.4)', cursor: 'pointer', padding: '10px 28px', fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.94)' }}>
          Return home
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#1c1820' }}>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, fontStyle: 'italic', color: 'rgba(245,240,232,0.82)', letterSpacing: '0.05em' }}>
        Signing you in…
      </p>
    </div>
  )
}
