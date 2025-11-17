'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api'
const ACCESS_TOKEN_COOKIE = 'smw_access_token'
const REFRESH_TOKEN_COOKIE = 'smw_refresh_token'
const IS_STAFF_COOKIE = 'smw_is_staff'
const ACCESS_TOKEN_MAX_AGE = 15 * 60 // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 // 7 days
const STAFF_COOKIE_MAX_AGE = REFRESH_TOKEN_MAX_AGE

export type AuthUser = {
  id: number
  email: string
  firstName?: string
  lastName?: string
  fullName: string
  isStaff: boolean
  isSuperuser: boolean
}

export type UserProfile = {
  id: number
  user: {
    id: number
    email: string
    f_name?: string | null
    l_name?: string | null
    is_active: boolean
    is_staff: boolean
    is_superuser: boolean
  }
  phone?: string | null
  photo_url?: string | null
  current_class?: string | null
  group_name?: string | null
  student_uid?: string | null
  [key: string]: unknown
}

type LoginPayload = {
  email: string
  password: string
}

type LoginResult = {
  success: boolean
  message?: string
}

type AuthContextValue = {
  user: AuthUser | null
  profile: UserProfile | null
  initializing: boolean
  accessToken: string | null
  login: (payload: LoginPayload) => Promise<LoginResult>
  logout: () => Promise<void>
  fetchWithAuth: (
    input: RequestInfo | URL,
    init?: RequestInit,
    options?: { skipAuth?: boolean }
  ) => Promise<Response>
  refreshAccessToken: () => Promise<string | null>
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

const isBrowser = () => typeof document !== 'undefined'

function buildApiUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const normalizedBase = API_BASE_URL.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  return `${normalizedBase}/${normalizedPath}`
}

function findCookie(name: string) {
  return document.cookie
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [key, ...rest] = entry.split('=')
      return [key, rest.join('=')]
    })
    .find(([key]) => key === name)
}

function getCookieValue(name: string) {
  if (!isBrowser()) return null
  const found = findCookie(name)
  return found ? decodeURIComponent(found[1]) : null
}

function setCookieValue(name: string, value: string, maxAgeSeconds?: number) {
  if (!isBrowser()) return
  let cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`
  if (typeof maxAgeSeconds === 'number') {
    cookie += `; max-age=${maxAgeSeconds}`
  }
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    cookie += '; Secure'
  }
  document.cookie = cookie
}

function deleteCookie(name: string) {
  if (!isBrowser()) return
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
}

function deriveUser(profile: UserProfile | null): AuthUser | null {
  if (!profile?.user) return null
  const first = profile.user.f_name?.trim() ?? ''
  const last = profile.user.l_name?.trim() ?? ''
  const fullName = `${first} ${last}`.trim() || profile.user.email
  return {
    id: profile.user.id,
    email: profile.user.email,
    firstName: first || undefined,
    lastName: last || undefined,
    fullName,
    isStaff: Boolean(profile.user.is_staff),
    isSuperuser: Boolean(profile.user.is_superuser),
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = React.useState<string | null>(null)
  const [refreshToken, setRefreshToken] = React.useState<string | null>(null)
  const [initializing, setInitializing] = React.useState(true)

  const persistAccessToken = React.useCallback((token: string | null) => {
    setAccessToken(token)
    if (token) {
      setCookieValue(ACCESS_TOKEN_COOKIE, token, ACCESS_TOKEN_MAX_AGE)
    } else {
      deleteCookie(ACCESS_TOKEN_COOKIE)
    }
  }, [])

  const persistRefreshToken = React.useCallback((token: string | null) => {
    setRefreshToken(token)
    if (token) {
      setCookieValue(REFRESH_TOKEN_COOKIE, token, REFRESH_TOKEN_MAX_AGE)
    } else {
      deleteCookie(REFRESH_TOKEN_COOKIE)
    }
  }, [])

  const persistIsStaff = React.useCallback((isStaff: boolean) => {
    if (isStaff) {
      setCookieValue(IS_STAFF_COOKIE, 'true', STAFF_COOKIE_MAX_AGE)
    } else {
      deleteCookie(IS_STAFF_COOKIE)
    }
  }, [])

  const clearSession = React.useCallback(() => {
    setProfile(null)
    setUser(null)
    persistAccessToken(null)
    persistRefreshToken(null)
    persistIsStaff(false)
  }, [persistAccessToken, persistRefreshToken, persistIsStaff])

  const refreshAccessToken = React.useCallback(
    async (overrideToken?: string | null) => {
      const tokenToUse = overrideToken ?? refreshToken ?? getCookieValue(REFRESH_TOKEN_COOKIE)
      if (!tokenToUse) {
        return null
      }
      try {
        const response = await fetch(buildApiUrl('/token/refresh/'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: tokenToUse }),
        })
        if (!response.ok) {
          clearSession()
          return null
        }
        const data = await response.json()
        if (data?.access) {
          persistAccessToken(data.access)
          return data.access as string
        }
        return null
      } catch (error) {
        console.error('Unable to refresh access token', error)
        clearSession()
        return null
      }
    },
    [refreshToken, clearSession, persistAccessToken],
  )

  const loadProfile = React.useCallback(
    async (tokenOverride?: string | null) => {
      const tokenToUse = tokenOverride ?? accessToken ?? getCookieValue(ACCESS_TOKEN_COOKIE)
      if (!tokenToUse) {
        return null
      }

      const requestProfile = async (token: string): Promise<UserProfile | null> => {
        try {
          const response = await fetch(buildApiUrl('/profile/'), {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const profileData = (await response.json()) as UserProfile
            setProfile(profileData)
            const derived = deriveUser(profileData)
            setUser(derived)
            persistIsStaff(Boolean(derived?.isStaff))
            return profileData
          }

          if (response.status === 401) {
            const refreshed = await refreshAccessToken()
            if (refreshed) {
              return requestProfile(refreshed)
            }
          }
        } catch (error) {
          console.error('Failed to load profile', error)
        }
        return null
      }

      return requestProfile(tokenToUse)
    },
    [accessToken, persistIsStaff, refreshAccessToken],
  )

  const fetchWithAuth = React.useCallback<AuthContextValue['fetchWithAuth']>(
    async (input, init, options) => {
      const headers = new Headers(init?.headers ?? {})
      if (!options?.skipAuth) {
        const token = accessToken ?? getCookieValue(ACCESS_TOKEN_COOKIE)
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
      }
      let response = await fetch(input, { ...init, headers })

      if (response.status === 401 && !options?.skipAuth) {
        const refreshed = await refreshAccessToken()
        if (refreshed) {
          headers.set('Authorization', `Bearer ${refreshed}`)
          response = await fetch(input, { ...init, headers })
        }
      }

      return response
    },
    [accessToken, refreshAccessToken],
  )

  const login = React.useCallback(
    async ({ email, password }: LoginPayload): Promise<LoginResult> => {
      try {
        const response = await fetch(buildApiUrl('/admin/login/'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData?.detail ?? 'Invalid credentials')
        }

        const data = await response.json()
        if (!data?.access || !data?.refresh) {
          throw new Error('Malformed response from server')
        }

        persistAccessToken(data.access)
        persistRefreshToken(data.refresh)

        const profileData = await loadProfile(data.access)
        if (!profileData?.user?.is_staff) {
          throw new Error('This account is not authorized for admin access.')
        }

        router.push('/admin')
        return { success: true }
      } catch (error) {
        clearSession()
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Unable to login right now.',
        }
      }
    },
    [loadProfile, persistAccessToken, persistRefreshToken, router, clearSession],
  )

  const logout = React.useCallback(async () => {
    const refreshValue = refreshToken ?? getCookieValue(REFRESH_TOKEN_COOKIE)
    try {
      if (refreshValue) {
        await fetch(buildApiUrl('/logout/'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken
              ? {
                  Authorization: `Bearer ${accessToken}`,
                }
              : {}),
          },
          body: JSON.stringify({ refresh: refreshValue }),
        })
      }
    } catch (error) {
      console.error('Failed to logout cleanly', error)
    } finally {
      clearSession()
      router.push('/admin/login')
    }
  }, [accessToken, refreshToken, router, clearSession])

  React.useEffect(() => {
    if (!isBrowser()) {
      return
    }
    let isMounted = true
    const bootstrap = async () => {
      const storedAccess = getCookieValue(ACCESS_TOKEN_COOKIE)
      const storedRefresh = getCookieValue(REFRESH_TOKEN_COOKIE)
      if (isMounted) {
        if (storedAccess) setAccessToken(storedAccess)
        if (storedRefresh) setRefreshToken(storedRefresh)
      }

      if (!storedAccess && storedRefresh) {
        const refreshed = await refreshAccessToken(storedRefresh)
        if (refreshed) {
          await loadProfile(refreshed)
        }
      } else if (storedAccess) {
        await loadProfile(storedAccess)
      }

      if (isMounted) {
        setInitializing(false)
      }
    }

    bootstrap().catch(() => {
      if (isMounted) {
        setInitializing(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [loadProfile, refreshAccessToken])

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      initializing,
      accessToken,
      login,
      logout,
      fetchWithAuth,
      refreshAccessToken,
    }),
    [user, profile, initializing, accessToken, login, logout, fetchWithAuth, refreshAccessToken],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
