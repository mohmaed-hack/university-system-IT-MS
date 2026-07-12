import { NextResponse } from 'next/server'
import { loadAppData, saveAppData } from '@/lib/data-store'
import { isAdminRequest } from '@/lib/admin-auth'
import { GitHubStorageError } from '@/lib/github-storage'
import type { AppData } from '@/lib/app-context'

export const dynamic = 'force-dynamic'

/** GET /api/data — returns the current application data (public read). */
export async function GET() {
  try {
    const { data, fromGitHub } = await loadAppData()
    return NextResponse.json({ data, fromGitHub })
  } catch (error) {
    const message = error instanceof GitHubStorageError ? error.message : 'Failed to load data'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/** PUT /api/data — replaces the application data (admin only, commits to GitHub). */
export async function PUT(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  let body: { data?: AppData; message?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'صيغة غير صحيحة' }, { status: 400 })
  }

  if (!body.data || typeof body.data !== 'object') {
    return NextResponse.json({ error: 'البيانات مفقودة' }, { status: 400 })
  }

  try {
    await saveAppData(body.data, body.message)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof GitHubStorageError ? error.message : 'Failed to save data'
    const status = error instanceof GitHubStorageError && error.status ? error.status : 500
    return NextResponse.json({ error: message }, { status })
  }
}
