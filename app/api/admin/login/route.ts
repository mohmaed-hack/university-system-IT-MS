import { NextResponse } from 'next/server'
import { verifyPassword, setAdminCookie } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

/** POST /api/admin/login — verifies the password and sets the session cookie. */
export async function POST(request: Request) {
  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'صيغة غير صحيحة' }, { status: 400 })
  }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'لم يتم ضبط كلمة مرور المشرف على الخادم' },
      { status: 500 },
    )
  }

  if (!body.password || !verifyPassword(body.password)) {
    return NextResponse.json({ error: 'كلمة المرور غير صحيحة' }, { status: 401 })
  }

  await setAdminCookie()
  return NextResponse.json({ ok: true })
}
