import 'server-only'
import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

/**
 * ──────────────────────────────────────────────────────────────
 *  Admin authentication (server-side)
 * ──────────────────────────────────────────────────────────────
 *  The admin password is checked on the server against the
 *  ADMIN_PASSWORD environment variable. It is never shipped to the
 *  client. On success we set a signed, http-only cookie whose value
 *  is an HMAC derived from the password, so it cannot be forged
 *  without knowing the secret.
 */

export const ADMIN_COOKIE = 'admin_session'
const SESSION_PAYLOAD = 'admin-v1'
const COOKIE_MAX_AGE = 60 * 60 * 12 // 12 hours

function getAdminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null
}

/** Computes the signed session token for the configured password. */
function sessionToken(password: string): string {
  return createHmac('sha256', password).update(SESSION_PAYLOAD).digest('hex')
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

/** Verifies a plaintext password against ADMIN_PASSWORD. */
export function verifyPassword(password: string): boolean {
  const expected = getAdminPassword()
  if (!expected) return false
  return safeEqual(password, expected)
}

/** Returns the cookie value to store for an authenticated admin session. */
export function createSessionValue(): string | null {
  const password = getAdminPassword()
  if (!password) return null
  return sessionToken(password)
}

/** Sets the http-only admin session cookie. */
export async function setAdminCookie(): Promise<void> {
  const value = createSessionValue()
  if (!value) return
  const store = await cookies()
  store.set(ADMIN_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })
}

/** Clears the admin session cookie. */
export async function clearAdminCookie(): Promise<void> {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
}

/** Returns true when the current request carries a valid admin session. */
export async function isAdminRequest(): Promise<boolean> {
  const password = getAdminPassword()
  if (!password) return false
  const store = await cookies()
  const token = store.get(ADMIN_COOKIE)?.value
  if (!token) return false
  return safeEqual(token, sessionToken(password))
}
