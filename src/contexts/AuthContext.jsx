import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import apiService from '../services/api.service'

const PORTAL_MEMBER_USER_KEY = 'portal.member.user'

const AuthContext = createContext(null)

function parseStoredUser() {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(PORTAL_MEMBER_USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => parseStoredUser())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function bootstrap() {
      const token = apiService.getStoredAccessToken()
      if (!token) {
        if (active) setLoading(false)
        return
      }

      try {
        const me = await apiService.getMe()
        if (!active) return
        setUser(me)
        window.localStorage.setItem(PORTAL_MEMBER_USER_KEY, JSON.stringify(me))
      } catch (error) {
        apiService.clearAuthSession()
        window.localStorage.removeItem(PORTAL_MEMBER_USER_KEY)
        if (active) {
          setUser(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    bootstrap()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const handleAuthExpired = () => {
      window.localStorage.removeItem(PORTAL_MEMBER_USER_KEY)
      setUser(null)
    }

    window.addEventListener('portal.member.authExpired', handleAuthExpired)
    return () => window.removeEventListener('portal.member.authExpired', handleAuthExpired)
  }, [])

  const login = async (email, senha, tenantSlug) => {
    const result = await apiService.login({ email, senha, tenantSlug })
    apiService.storeAuthSession(result)
    setUser(result.usuario)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PORTAL_MEMBER_USER_KEY, JSON.stringify(result.usuario))
    }
    return result.usuario
  }

  const logout = () => {
    apiService.clearAuthSession()
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(PORTAL_MEMBER_USER_KEY)
    }
    setUser(null)
  }

  const refreshUser = async () => {
    const me = await apiService.getMe()
    setUser(me)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PORTAL_MEMBER_USER_KEY, JSON.stringify(me))
    }
    return me
  }

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    logout,
    refreshUser
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
