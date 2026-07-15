import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { wixClient } from './wix'
import { LoginState } from '@wix/sdk'

const TOKENS_KEY = 'wix_tokens'
const MEMBER_KEY = 'wix_member'

export interface WixMember {
  id: string
  nickname: string
  email: string
  photoUrl?: string
}

interface AuthCtx {
  member: WixMember | null
  login: (email: string, password: string) => Promise<{ error?: string; needsVerification?: boolean; stateToken?: string }>
  verify: (code: string, stateToken: string) => Promise<{ error?: string }>
  logout: () => void
  rehydrateFromTokens: (tokens: unknown) => void
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Read cached member synchronously — no network call, no loading state
  const [member, setMember] = useState<WixMember | null>(() => {
    try {
      const raw = localStorage.getItem(MEMBER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  // Rehydrate Wix SDK tokens synchronously on mount (no network)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(TOKENS_KEY)
      if (raw) wixClient.auth.setTokens(JSON.parse(raw))
    } catch { /* stale tokens — ignore */ }
  }, [])

  function saveMember(m: WixMember) {
    setMember(m)
    localStorage.setItem(MEMBER_KEY, JSON.stringify(m))
  }

  async function fetchAndSaveMember() {
    try {
      const res = await (wixClient.members as any).getCurrentMember({ fieldsets: ['FULL'] })
      const m = res?.member
      if (!m) return
      saveMember({
        id: m._id ?? '',
        nickname: m.profile?.nickname ?? m.loginEmail?.split('@')[0] ?? 'Member',
        email: m.loginEmail ?? '',
        photoUrl: m.profile?.photo?.url,
      })
    } catch { /* ignore */ }
  }

  async function login(email: string, password: string) {
    try {
      const result = await (wixClient.auth as any).login({ email, password })

      if (result.loginState === LoginState.SUCCESS) {
        const tokens = await (wixClient.auth as any).getMemberTokensForDirectLogin(result.data.sessionToken)
        wixClient.auth.setTokens(tokens)
        localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))
        // Optimistically set member from email, then fetch full profile in background
        saveMember({ id: '', nickname: email.split('@')[0], email, photoUrl: undefined })
        fetchAndSaveMember()
        return {}
      }

      if (result.loginState === LoginState.EMAIL_VERIFICATION_REQUIRED) {
        return { needsVerification: true, stateToken: result.data.stateToken }
      }

      if (result.loginState === LoginState.FAILURE) {
        const code = result.errorCode
        if (code === 'invalidEmail' || code === 'invalidPassword') return { error: 'Incorrect email or password.' }
        if (code === 'resetPassword') return { error: 'Please reset your password via email.' }
        return { error: result.error ?? 'Login failed.' }
      }

      return { error: 'Unexpected login state.' }
    } catch (e: any) {
      return { error: e?.message ?? 'Login failed.' }
    }
  }

  async function verify(code: string, stateToken: string) {
    try {
      const result = await (wixClient.auth as any).processVerification(
        { verificationCode: code },
        { loginState: LoginState.EMAIL_VERIFICATION_REQUIRED, data: { stateToken } }
      )
      if (result.loginState === LoginState.SUCCESS) {
        const tokens = await (wixClient.auth as any).getMemberTokensForDirectLogin(result.data.sessionToken)
        wixClient.auth.setTokens(tokens)
        localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))
        fetchAndSaveMember()
        return {}
      }
      return { error: 'Verification failed.' }
    } catch (e: any) {
      return { error: e?.message ?? 'Verification failed.' }
    }
  }

  function logout() {
    localStorage.removeItem(TOKENS_KEY)
    localStorage.removeItem(MEMBER_KEY)
    setMember(null)
    // Clear Wix session by generating fresh visitor tokens in background
    ;(wixClient.auth as any).generateVisitorTokens().catch(() => {})
  }

  function rehydrateFromTokens(_tokens: unknown) {
    fetchAndSaveMember()
  }

  return <Ctx.Provider value={{ member, login, verify, logout, rehydrateFromTokens }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
