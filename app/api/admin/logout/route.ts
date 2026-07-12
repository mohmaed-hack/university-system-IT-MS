import { NextResponse } from 'next/server'
import { clearAdminCookie } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

/** POST /api/admin/logout — clears the admin session cookie. */
export async function POST() {
  await clearAdminCookie()
  return NextResponse.json({ ok: true })
}
