import { NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

/** GET /api/admin/session — reports whether the current request is an admin. */
export async function GET() {
  const isAdmin = await isAdminRequest()
  return NextResponse.json({ isAdmin })
}
